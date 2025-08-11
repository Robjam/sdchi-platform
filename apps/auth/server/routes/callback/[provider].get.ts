import * as oauth from 'oauth4webapi';
import { defineEventHandler, sendError, setCookie, sendRedirect, getRouterParam, getQuery, createError } from 'h3';
import { eq, and } from 'drizzle-orm';
import { useDb } from '../../../db';
import { idpAuthRequests, sdchiAuthRequests, idps, sdchiAuthorizationCodes } from '../../../db/schema/oidc';
import { sessions } from '../../../db/schema/sessions';
import { users } from '../../../db/schema/users';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const providerId = getRouterParam(event, 'provider')!;
  const query = getQuery(event);
  const db = useDb((event.context.cloudflare.env as any));

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

    if (!idpAuthRequest || idpAuthRequest.providerId !== providerId) {
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

    // Get provider configuration
    const [provider] = await db
      .select()
      .from(idps)
      .where(eq(idps.id, providerId))
      .limit(1);

    if (!provider) {
      return sendError(event, createError({
        statusCode: 400,
        message: 'Provider not found'
      }));
    }
    // Create oauth4webapi client and server config
    const authServer: oauth.AuthorizationServer = provider.discoveryUrl
      ? {
        issuer: provider.discoveryUrl.replace('/.well-known/openid_configuration', ''),
        token_endpoint: `${provider.discoveryUrl.replace('/.well-known/openid_configuration', '')}/oauth/token`,
        id_token_signing_alg_values_supported: ['HS256'],
      }
      : {
        issuer: new URL(provider.authorizationUrl!).origin,
        authorization_endpoint: provider.authorizationUrl!,
        token_endpoint: provider.tokenUrl!,
        userinfo_endpoint: provider.userInfoUrl!,
        id_token_signing_alg_values_supported: ['HS256'],
      };

    const client: oauth.Client = {
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
    };

    // Exchange authorization code for tokens using oauth4webapi
    const callbackUrl = new URL(event.node.req.url!, `https://${event.headers.get('host')}/portal/callback`);
    const callbackParams = oauth.validateAuthResponse(authServer, client, callbackUrl, idpAuthRequest.state);

    const clientAuthentication = oauth.ClientSecretPost(provider.clientSecret)

    const tokenRequest = await oauth.authorizationCodeGrantRequest(
      authServer,
      client,
      clientAuthentication,
      callbackParams,
      idpAuthRequest.redirectUri,
      idpAuthRequest.codeVerifier
    );

    const result = await oauth.processAuthorizationCodeResponse(authServer, client, tokenRequest, {
      expectedNonce: idpAuthRequest.nonce,
    });

    // Update IDP auth request with tokens
    await db
      .update(idpAuthRequests)
      .set({
        status: 'completed',
        authCode: query.code.toString()
      })
      .where(eq(idpAuthRequests.id, idpAuthRequest.id));

    // Update main auth request status
    await db
      .update(sdchiAuthRequests)
      .set({ status: 'completed' })
      .where(eq(sdchiAuthRequests.id, idpAuthRequest.authRequestId));

    // Extract user info from ID token
    const claims = oauth.getValidatedIdTokenClaims(result);
    const userEmail = claims?.email as string;
    const userSub = claims?.sub as string;

    if (!userSub) {
      return sendError(event, createError({
        statusCode: 400,
        message: 'Missing required sub claim in ID token'
      }));
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.providerId, providerId), eq(users.providerSub, userSub)))
      .limit(1);

    if (!user) {
      const userId = randomUUID();
      await db.insert(users).values({
        id: userId,
        providerId: providerId,
        providerSub: userSub,
        email: userEmail,
        emailVerified: false,
      });

      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
    }

    // Create session with tokens
    const sessionId = randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      authSource: providerId,
      sdchiAuthRequestId: idpAuthRequest.authRequestId,
      idpAuthRequestId: idpAuthRequest.id,
      userAgent: event.context.cloudflare?.request?.cf.userAgent || '',
      ipAddress: event.context.cloudflare?.request.cf?.ip || '',
      active: true,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      idToken: result.id_token,
      tokenType: result.token_type || 'Bearer',
      scope: idpAuthRequest.scopes,
      expiresAt: sessionExpiresAt,
    });

    // Set session cookie for auth domain only
    const config = useRuntimeConfig(event);
    setCookie(event, 'sdchi_auth_session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: config.cookieDomain,
      path: '/',
      maxAge: parseInt(config.sessionMaxAge), // seconds
    });

    // Update user ID in IDP auth request
    await db
      .update(idpAuthRequests)
      .set({ userId: user.id })
      .where(eq(idpAuthRequests.id, idpAuthRequest.id));

    // Generate authorization code for client and redirect back
    const authRequest = await db
      .select()
      .from(sdchiAuthRequests)
      .where(eq(sdchiAuthRequests.id, idpAuthRequest.authRequestId))
      .limit(1);

    if (!authRequest[0]) {
      return sendError(event, createError({
        statusCode: 400,
        message: 'Auth request not found'
      }));
    }

    // Generate and store authorization code
    const authCode = randomUUID();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(sdchiAuthorizationCodes).values({
      id: authCode,
      authRequestId: authRequest[0].id,
      userId: user.id,
      sessionId: sessionId,
      used: false,
      expiresAt: codeExpiresAt,
    });

    // Build redirect URL back to client
    const redirectUrl = new URL(authRequest[0].redirectUri);
    redirectUrl.searchParams.set('code', authCode);
    redirectUrl.searchParams.set('state', authRequest[0].state);

    return sendRedirect(event, redirectUrl.toString());
  } catch (e) {
    console.log('Error during authentication:', e);
    return sendError(event, createError({
      statusCode: 500,
      message: 'Authentication failed: ' + (e as Error).message
    }));
  }
});

