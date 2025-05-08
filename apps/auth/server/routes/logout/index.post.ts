import { defineEventHandler, sendError, deleteCookie, sendRedirect, readBody, createError, getCookie } from 'h3';
import { eq, and } from 'drizzle-orm';
import { useDb } from '~~/db';
import { sessions, sessionActivities } from '~~/db/schema/sessions';
import { sdchiClients } from '~~/db/schema/oidc';
import { validateCsrfToken } from '~~/server/utils/csrf';
import { randomUUID } from 'crypto';

interface LogoutBody {
  id_token_hint?: string;
  post_logout_redirect_uri?: string;
  state?: string;
  csrf_token?: string;
}

export default defineEventHandler(async (event) => {
  const db = useDb((event.context.cloudflare.env as any));
  const config = useRuntimeConfig();

  try {
    // Get session cookie
    const sessionId = getCookie(event, 'sdchi_auth_session');
    if (!sessionId) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'No active session found'
      }));
    }

    // Read request body
    const body: LogoutBody = await readBody(event);

    // Validate CSRF token
    validateCsrfToken(event, body.csrf_token);

    // Get session from database
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.id, sessionId),
        eq(sessions.active, true)
      ))
      .limit(1);

    if (!session) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired session'
      }));
    }

    // Validate post_logout_redirect_uri if provided
    let redirectUri = body.post_logout_redirect_uri;
    if (redirectUri) {
      const isValid = await validateLogoutRedirectUri(db, redirectUri);
      if (!isValid) {
        return sendError(event, createError({
          statusCode: 400,
          statusMessage: 'Invalid post_logout_redirect_uri'
        }));
      }
    }

    // Mark session as inactive
    await db
      .update(sessions)
      .set({
        active: false,
        revokedAt: new Date(),
        revokedReason: 'user_logout'
      })
      .where(eq(sessions.id, sessionId));

    const sessionActivityId: string = randomUUID();

    // Log logout activity
    await db.insert(sessionActivities).values({
      id: sessionActivityId,
      sessionId: sessionId,
      activityType: 'logout',
      description: 'User initiated logout',
      ipAddress: event.context.cloudflare?.request?.cf?.ip || '',
      userAgent: event.context.cloudflare?.request?.cf?.userAgent || '',
      successful: true
    });

    // Clear session cookie
    deleteCookie(event, 'sdchi_auth_session', {
      domain: config.cookieDomain,
      path: '/',
      secure: true,
      sameSite: 'lax'
    });

    // Attempt upstream IDP logout (non-blocking)
    await attemptUpstreamLogout(session);

    // Redirect or return success
    if (redirectUri) {
      const redirectUrl = new URL(redirectUri);
      if (body.state) {
        redirectUrl.searchParams.set('state', body.state);
      }
      return sendRedirect(event, redirectUrl.toString());
    }

    // Return success response
    return {
      success: true,
      message: 'Logout successful'
    };

  } catch (error) {
    // Log failed logout attempt
    const sessionId = getCookie(event, 'sdchi_auth_session');
    if (sessionId) {
      try {
        await db.insert(sessionActivities).values({
          id: randomUUID() as string,
          sessionId: sessionId,
          activityType: 'logout',
          description: 'Logout attempt failed',
          ipAddress: event.context.cloudflare?.request?.cf?.ip || '',
          userAgent: event.context.cloudflare?.request?.cf?.userAgent || '',
          successful: false,
          failureReason: (error as Error).message
        });
      } catch (logError) {
        console.error('Failed to log logout failure:', logError);
      }
    }

    console.error('Logout error:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Logout failed'
    }));
  }
});

/**
 * Validates logout redirect URI against registered client URIs
 */
async function validateLogoutRedirectUri(db: any, redirectUri: string): Promise<boolean> {
  try {
    // Parse the redirect URI
    const url = new URL(redirectUri);

    // Reject dangerous schemes
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // For production, require HTTPS
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      return false;
    }

    // Get all registered clients and their allowed logout redirect URIs
    const clients = await db
      .select({
        id: sdchiClients.id,
        redirectUris: sdchiClients.redirectUris,
        allowedLogoutRedirectUris: sdchiClients.allowedLogoutRedirectUris
      })
      .from(sdchiClients);

    // Check if the redirect URI matches any client's allowed URIs
    for (const client of clients) {
      // First check specific logout redirect URIs if configured
      if (client.allowedLogoutRedirectUris) {
        const allowedLogoutUris = JSON.parse(client.allowedLogoutRedirectUris) as string[];

        for (const allowedUri of allowedLogoutUris) {
          // Allow exact match
          if (redirectUri === allowedUri) {
            return true;
          }

          // Allow same origin with different path
          const allowedUrl = new URL(allowedUri);
          if (url.origin === allowedUrl.origin) {
            return true;
          }
        }
      }

      // Fallback to regular redirect URIs for same-origin check
      const allowedUris = JSON.parse(client.redirectUris) as string[];
      for (const allowedUri of allowedUris) {
        const allowedUrl = new URL(allowedUri);

        // Allow same origin with different path
        if (url.origin === allowedUrl.origin) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error validating logout redirect URI:', error);
    return false;
  }
}

/**
 * Attempts to logout from upstream identity provider
 * This is done on a best-effort basis and won't fail the logout process
 */
async function attemptUpstreamLogout(session: any): Promise<void> {
  try {
    if (session.authSource === 'line' && session.accessToken) {
      // LINE supports token revocation
      await revokeLineTokens(session.accessToken);
    } else if (session.authSource === 'azure' && session.idToken) {
      // Azure supports logout but requires redirect - log for future implementation
      console.log('Azure logout would require redirect to:', buildAzureLogoutUrl(session.idToken));
    }
  } catch (error) {
    // Log error but don't fail the logout process
    console.warn('Upstream logout failed:', error);
  }
}

/**
 * Revokes LINE access tokens
 */
async function revokeLineTokens(accessToken: string): Promise<void> {
  try {
    const response = await fetch('https://api.line.me/oauth2/v2.1/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`LINE token revocation failed: ${response.status}`);
    }
  } catch (error) {
    console.warn('Failed to revoke LINE tokens:', error);
    throw error;
  }
}

/**
 * Builds Azure logout URL for future implementation
 */
function buildAzureLogoutUrl(idToken: string): string {
  const baseUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';
  const params = new URLSearchParams({
    id_token_hint: idToken,
  });
  return `${baseUrl}?${params.toString()}`;
}