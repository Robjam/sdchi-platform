import * as oauth from 'oauth4webapi';
import { defineEventHandler, readBody, sendRedirect } from 'h3';
import type { H3Event } from 'h3';
import { eq } from 'drizzle-orm';
import { useDb } from '../../../db';
import { sdchiAuthRequests, idpAuthRequests, idps } from '../../../db/schema/oidc';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event: H3Event) => {
  const db = useDb((event.context.cloudflare.env as any));

  // Read form data
  const body = await readBody(event);
  const authRequestId = body.auth_request_id;
  const providerId = body.provider_id;

  if (!authRequestId || !providerId) {
    throw new Error("Missing required parameters: auth_request_id and provider_id");
  }

  // Validate auth request exists and is not expired
  const [authRequest] = await db
    .select()
    .from(sdchiAuthRequests)
    .where(eq(sdchiAuthRequests.id, authRequestId))
    .limit(1);

  if (!authRequest) {
    throw new Error("Invalid auth request");
  }

  if (authRequest.expiresAt < new Date()) {
    throw new Error("Auth request has expired");
  }

  if (authRequest.status !== 'initiated') {
    throw new Error("Auth request already processed");
  }

  // Get IDP provider configuration
  const [provider] = await db
    .select()
    .from(idps)
    .where(eq(idps.id, providerId))
    .limit(1);

  if (!provider) {
    throw new Error("Identity provider not found");
  }

  // Generate PKCE and state for IDP flow
  const state = oauth.generateRandomState();
  const codeVerifier = oauth.generateRandomCodeVerifier();
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
  const nonce = oauth.generateRandomNonce();

  // Create IDP auth request record
  const idpAuthRequestId = randomUUID();
  const idpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await db.insert(idpAuthRequests).values({
    id: idpAuthRequestId,
    providerId: providerId,
    authRequestId: authRequestId,
    redirectUri: `${event.context.cloudflare.env.BASE_URL}/callback/${providerId}`,
    state: state,
    nonce: nonce,
    codeVerifier: codeVerifier,
    challenge: codeChallenge,
    challengeMethod: 'S256',
    scopes: provider.scopes,
    status: 'initiated',
    expiresAt: idpExpiresAt,
  });

  // Update auth request status
  await db
    .update(sdchiAuthRequests)
    .set({ status: 'idp_selected' })
    .where(eq(sdchiAuthRequests.id, authRequestId));

  // Create authorization server configuration
  const authServer: oauth.AuthorizationServer = provider.discoveryUrl
    ? {
      issuer: provider.discoveryUrl.replace('/.well-known/openid_configuration', ''),
      authorization_endpoint: `${provider.discoveryUrl.replace('/.well-known/openid_configuration', '')}/oauth/authorize`,
    }
    : {
      issuer: new URL(provider.authorizationUrl!).origin,
      authorization_endpoint: provider.authorizationUrl!,
      token_endpoint: provider.tokenUrl!,
      userinfo_endpoint: provider.userInfoUrl!,
    };

  // Create client configuration
  const client: oauth.Client = {
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
  };

  // Build authorization URL
  const authUrl = new URL(authServer.authorization_endpoint!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', client.client_id);
  authUrl.searchParams.set('redirect_uri', `${event.context.cloudflare.env.BASE_URL}/callback/${providerId}`);
  authUrl.searchParams.set('scope', provider.scopes);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('nonce', nonce);

  return sendRedirect(event, authUrl.toString());
});