import { defineEventHandler, sendError, setCookie, sendRedirect, getQuery, createError } from 'h3';
import { eq } from 'drizzle-orm';
import { useDb } from '~/db';
import { idpAuthRequests } from '~/db/schema/oidc';
import { sessions } from '~/db/schema/sessions';
import { users } from '~/db/schema/users';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const db = useDb(event.context.cloudflare.env);

  // Validate required parameters
  if (!query.code || !query.state) {
    return sendError(event, createError({
      statusCode: 400,
      message: 'Missing required parameters'
    }));
  }

  try {
    // Find IDP auth request by state
    const [idpAuthRequest] = await db
      .select()
      .from(idpAuthRequests)
      .where(eq(idpAuthRequests.state, query.state.toString()))
      .limit(1);

    if (!idpAuthRequest) {
      return sendError(event, createError({
        statusCode: 400,
        message: 'Invalid state parameter'
      }));
    }

    if (idpAuthRequest.expiresAt < new Date()) {
      return sendError(event, createError({
        statusCode: 400,
        message: 'Auth request has expired'
      }));
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://auth.labs.localhost.localdomain:3000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'a7fd8769-858c-4b86-81a1-e3d825e6cc7d',
        code: query.code.toString(),
        redirect_uri: 'https://open.labs.localhost.localdomain:2500/auth/callback',
        code_verifier: idpAuthRequest.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      console.log('Token exchange failed:', tokenResponse.status, tokenResponse.statusText);
      const errorText = await tokenResponse.text();
      console.log('Error response:', errorText);
      return sendError(event, createError({
        statusCode: 400,
        message: 'Failed to exchange authorization code'
      }));
    }

    const tokens = await tokenResponse.json();

    // Update IDP auth request with completion status
    await db
      .update(idpAuthRequests)
      .set({
        status: 'completed',
        authCode: query.code.toString()
      })
      .where(eq(idpAuthRequests.id, idpAuthRequest.id));

    if (!tokens.id_token) {
      console.log('Missing ID token in response:', tokens);
      return sendError(event, createError({
        statusCode: 400,
        message: 'Missing ID token in response'
      }));
    }

    // Decode ID token (simplified - in production you'd verify the signature)
    const userInfo = JSON.parse(atob(tokens.id_token.split('.')[1]));

    if (!userInfo.sub) {
      console.log('Missing sub claim in ID token:', tokens.id_token);
      return sendError(event, createError({
        statusCode: 400,
        message: 'Missing required sub claim'
      }));
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.providerSub, userInfo.sub))
      .limit(1);

    if (!user) {
      const userId = randomUUID();
      await db.insert(users).values({
        id: userId,
        providerId: idpAuthRequest.providerId,
        providerSub: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        locale: userInfo.locale,
      });

      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
    } else {
      // Update existing user with latest profile information
      await db
        .update(users)
        .set({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          locale: userInfo.locale,
        })
        .where(eq(users.id, user.id));
    }

    // Create session
    const sessionId = randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      authSource: idpAuthRequest.providerId,
      userAgent: event.headers.get('user-agent') || '',
      ipAddress: event.context.cloudflare?.request.cf?.ip || '',
      active: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      tokenType: tokens.token_type || 'Bearer',
      scope: idpAuthRequest.scopes,
      expiresAt: sessionExpiresAt,
    });

    // Set session cookie
    setCookie(event, 'open_auth', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: 'open.labs.localhost.localdomain',
      path: '/',
      maxAge: 48 * 60 * 60, // 48 hours
    });

    // Update user ID in IDP auth request
    await db
      .update(idpAuthRequests)
      .set({ userId: user.id })
      .where(eq(idpAuthRequests.id, idpAuthRequest.id));

    // Redirect to home page
    return sendRedirect(event, idpAuthRequest.redirectUri || '/');
  } catch (e) {
    console.log('Error during authentication:', e);
    return sendError(event, createError({
      statusCode: 500,
      message: 'Authentication failed: ' + (e as Error).message
    }));
  }
});
