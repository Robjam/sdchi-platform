import { defineEventHandler, sendError, setCookie, sendRedirect, readBody, createError, getHeader } from 'h3';
import { eq, and } from 'drizzle-orm';
import { useDb } from '~/db';
import { sessions } from '~/db/schema/sessions';

export default defineEventHandler(async (event) => {
  const db = useDb(event.context.cloudflare.env);
  
  try {
    // Basic CSRF protection: validate referer header
    const referer = getHeader(event, 'referer');
    const origin = getHeader(event, 'origin');
    
    // Check if request comes from our domain
    const allowedOrigins = [
      'https://open.labs.localhost.localdomain:2500',
      'https://auth.labs.localhost.localdomain:3000'
    ];
    
    const requestOrigin = origin || (referer ? new URL(referer).origin : '');
    if (!allowedOrigins.includes(requestOrigin)) {
      return sendError(event, createError({
        statusCode: 403,
        message: 'CSRF protection: Invalid origin'
      }));
    }
    // Get session ID from cookie
    const cookieHeader = event.headers?.get('cookie');
    const sessionId = cookieHeader?.split('; ').find((cookie) => cookie.startsWith('open_auth='))?.split('=')[1];

    if (!sessionId) {
      return sendError(event, createError({
        statusCode: 401,
        message: 'No active session found'
      }));
    }

    // Find and validate the session
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
        message: 'Invalid or expired session'
      }));
    }

    // Read request body for potential redirect URI
    const body = await readBody(event).catch(() => ({}));
    const postLogoutRedirectUri = body.post_logout_redirect_uri;

    // Mark session as inactive in database
    await db
      .update(sessions)
      .set({
        active: false,
        revokedAt: new Date(),
        revokedReason: 'user_logout'
      })
      .where(eq(sessions.id, sessionId));

    // Clear the session cookie
    setCookie(event, 'open_auth', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: 'open.labs.localhost.localdomain',
      path: '/',
      maxAge: 0, // This will delete the cookie
      expires: new Date(0)
    });

    // Build logout URL for auth service
    const authLogoutUrl = new URL('https://auth.labs.localhost.localdomain:3000/logout');
    
    // Add post logout redirect URI if provided and valid
    if (postLogoutRedirectUri && typeof postLogoutRedirectUri === 'string') {
      // Basic validation - ensure it's an HTTPS URL pointing to our domain
      try {
        const redirectUrl = new URL(postLogoutRedirectUri);
        if (redirectUrl.protocol === 'https:' && 
            (redirectUrl.hostname === 'open.labs.localhost.localdomain' || 
             redirectUrl.hostname === 'auth.labs.localhost.localdomain')) {
          authLogoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);
        }
      } catch (e) {
        // Invalid URL, ignore the redirect parameter
      }
    } else {
      // Default redirect back to open app home page
      authLogoutUrl.searchParams.set('post_logout_redirect_uri', 'https://open.labs.localhost.localdomain:2500/');
    }

    // Add ID token hint if available
    if (session.idToken) {
      authLogoutUrl.searchParams.set('id_token_hint', session.idToken);
    }

    // Redirect to auth service logout endpoint
    return sendRedirect(event, authLogoutUrl.href);

  } catch (error) {
    console.error('Error during logout:', error);
    return sendError(event, createError({
      statusCode: 500,
      message: 'Logout failed'
    }));
  }
});