import * as oauth from 'oauth4webapi';
import { defineEventHandler, sendError, setCookie, sendRedirect, getQuery, createError } from 'h3';
import { eq, and } from 'drizzle-orm';
import { useDb } from '../../../../db';
import { portalAuthRequests, portalAdmins, portalSessions } from '../../../../db/schema/admin';
import { randomUUID, randomBytes } from 'crypto';

function getAzureConfig(event: any) {
  const config = useRuntimeConfig(event);
  const envVars = event.context.cloudflare.env as any;
  return {
    clientId: envVars.NITRO_AZURE_CLIENT_ID || config.azureClientId,
    tenantId: envVars.NITRO_AZURE_TENANT_ID || config.azureTenantId,
    scope: 'openid profile email',
  };
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const db = useDb((event.context.cloudflare.env as any));

  // Validate required parameters
  if (!query.code || !query.state) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters'
    }));
  }
  let errorMessage = 'no errors';
  try {
    const azureConfig = getAzureConfig(event);

    // Find auth request by state for CSRF protection
    const [authRequest] = await db
      .select()
      .from(portalAuthRequests)
      .where(eq(portalAuthRequests.state, query.state.toString()))
      .limit(1);

    if (!authRequest) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Invalid state parameter'
      }));
    }

    // Check if auth request has expired
    if (authRequest.expiresAt < new Date()) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Auth request has expired'
      }));
    }
    errorMessage = 'authRequest found';
    // Configure Azure Entra server
    const authServer: oauth.AuthorizationServer = {
      issuer: `https://login.microsoftonline.com/${azureConfig.tenantId}/v2.0`,
      authorization_endpoint: `https://login.microsoftonline.com/${azureConfig.tenantId}/oauth2/v2.0/authorize`,
      token_endpoint: `https://login.microsoftonline.com/${azureConfig.tenantId}/oauth2/v2.0/token`,
      id_token_signing_alg_values_supported: ['RS256'],
    };

    const client: oauth.Client = {
      client_id: azureConfig.clientId,
    };

    // Validate callback and exchange code for tokens
    const callbackUrl = new URL(event.node.req.url!, `https://${event.node.req.headers.host}`);
    const callbackParams = oauth.validateAuthResponse(authServer, client, callbackUrl, authRequest.state);

    // if (oauth.is(callbackParams)) {
    //   return sendError(event, createError({
    //     statusCode: 400,
    //     statusMessage: `OAuth error: ${callbackParams.error_description || callbackParams.error}`
    //   }));
    // }

    const config = useRuntimeConfig(event);
    const clientAuthentication = oauth.ClientSecretPost(event.context.cloudflare.env.NITRO_AZURE_CLIENT_SECRET as string || config.azureClientSecret);


    errorMessage = 'probably a client secret issue';


    // Exchange authorization code for tokens using PKCE
    const tokenRequest = await oauth.authorizationCodeGrantRequest(
      authServer,
      client,
      clientAuthentication,
      callbackParams,
      authRequest.redirectUri,
      authRequest.codeVerifier
    );

    const result = await oauth.processAuthorizationCodeResponse(authServer, client, tokenRequest, {
      expectedNonce: authRequest.nonce,
    });

    // const validOauthResponse = oauth.validateAuthResponse(authServer, client, callbackUrl, authRequest.state);
    // if (oauth.isOAuth2Error(result)) {
    //   return sendError(event, createError({
    //     statusCode: 400,
    //     statusMessage: `Token exchange error: ${result.error_description || result.error}`
    //   }));
    // }

    // Extract user info from ID token
    const claims = oauth.getValidatedIdTokenClaims(result);
    const userEmail = claims?.email as string;
    const userSub = claims?.sub as string;
    const userName = claims?.name as string;

    if (!userSub) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Missing required sub claim in ID token'
      }));
    }

    // Find or create portal admin user
    let [admin] = await db
      .select()
      .from(portalAdmins)
      .where(and(
        eq(portalAdmins.providerId, 'azure-entra'),
        eq(portalAdmins.providerSub, userSub)
      ))
      .limit(1);

    if (!admin) {
      const adminId = randomUUID();
      await db.insert(portalAdmins).values({
        id: adminId,
        providerId: 'azure-entra',
        providerSub: userSub,
        email: userEmail,
      });

      [admin] = await db
        .select()
        .from(portalAdmins)
        .where(eq(portalAdmins.id, adminId))
        .limit(1);
    }

    // Create secure session
    const sessionId = randomUUID();
    const csrfToken = randomBytes(32).toString('hex');
    const sessionExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(portalSessions).values({
      id: sessionId,
      userId: admin.id,
      authSource: 'azure-entra',
      portalAuthRequestId: authRequest.id,
      userAgent: event.headers.get('user-agent') || '',
      ipAddress: event.headers.get('x-forwarded-for') || event.headers.get('x-real-ip') || '',
      active: true,
      csrfToken,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      idToken: result.id_token,
      tokenType: result.token_type || 'Bearer',
      scope: azureConfig.scope,
      expiresAt: sessionExpiresAt,
      refreshTokenExpiresAt,
    });

    // Mark auth request as completed
    await db
      .update(portalAuthRequests)
      .set({ status: 'completed' })
      .where(eq(portalAuthRequests.id, authRequest.id));

    // Set secure session cookie
    setCookie(event, 'portal_auth', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    // Redirect to portal dashboard
    return sendRedirect(event, '/portal/clients');
  } catch (error) {
    console.error('Portal callback error:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Authentication failed'
    }));
  }
});