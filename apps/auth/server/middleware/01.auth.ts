import { useDb } from "~~/db";
import { portalSessions, portalAuthRequests } from "~~/db/schema/admin";
import { eq } from "drizzle-orm";
import * as oauth from 'oauth4webapi';
import { randomUUID, randomBytes } from 'crypto';
import { sendRedirect, createError } from 'h3';

const privateRoutes = [
  '/portal',
]

function getAzureConfig(event) {
  const config = useRuntimeConfig(event);
  return {
    clientId: config.azureClientId,
    tenantId: config.azureTenantId,
    discoveryUrl: `https://login.microsoftonline.com/${config.azureTenantId}/v2.0/.well-known/openid-configuration`,
    scope: 'openid profile email',
  };
}

export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  if (!privateRoutes.some(route => event.path.startsWith(route)) || event.path.startsWith('/portal/callback')) {
    return
  }

  const db = useDb((event.context.cloudflare.env as any));

  // Check for existing session
  const cookieHeader = event.headers.get('cookie');
  const sessionId = cookieHeader?.split('; ').find((cookie: string) => cookie.startsWith('portal_auth='))?.split('=')[1];

  if (sessionId) {
    const [session] = await db
      .select()
      .from(portalSessions)
      .where(eq(portalSessions.id, sessionId))
      .limit(1);

    if (session && session.active && session.expiresAt > new Date()) {
      event.context.user = {
        id: session.userId,
      }
      event.context.csrfToken = session.csrfToken;
      return
    }
  }

  let step = 0;

  // Initialize Azure Entra OIDC flow
  const azureConfig = getAzureConfig(event);
  try {
    const authServer: oauth.AuthorizationServer = {
      issuer: `https://login.microsoftonline.com/${azureConfig.tenantId}/v2.0`,
      authorization_endpoint: `https://login.microsoftonline.com/${azureConfig.tenantId}/oauth2/v2.0/authorize`,
      token_endpoint: `https://login.microsoftonline.com/${azureConfig.tenantId}/oauth2/v2.0/token`,
      id_token_signing_alg_values_supported: ['RS256'],
    };

    step++;

    const client: oauth.Client = {
      client_id: azureConfig.clientId,
    };
    step++;

    // Generate PKCE parameters using oauth4webapi
    const codeVerifier = oauth.generateRandomCodeVerifier();
    const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
    step++;

    // Generate security parameters
    const state = randomUUID();
    const nonce = randomUUID();
    const authRequestId = randomUUID();

    const redirectUri = `https://${event.headers.get('host')}/portal/callback`;
    step++;

    // Store auth request for security validation
    await db.insert(portalAuthRequests).values({
      id: authRequestId,
      clientId: azureConfig.clientId,
      redirectUri,
      responseType: 'code',
      state,
      nonce,
      codeVerifier,
      challenge: codeChallenge,
      challengeMethod: 'S256',
      scope: azureConfig.scope,
      status: 'initiated',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    step++;

    // Build authorization URL
    const authUrl = new URL(authServer.authorization_endpoint!);
    authUrl.searchParams.set('client_id', azureConfig.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', azureConfig.scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('nonce', nonce);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('response_mode', 'query');
    step++;

    return sendRedirect(event, authUrl.toString());
  } catch (error) {
    console.error('Auth middleware error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: JSON.stringify({ error, config: azureConfig, step })//'Authentication initialization failed',
    });
  }
});
