import { defineEventHandler, readBody, createError, sendError } from 'h3';
import { eq } from 'drizzle-orm';
import { useDb } from '../../../db';
import {
  sdchiAuthorizationCodes,
  sdchiAuthRequests,
  sdchiClients
} from '../../../db/schema/oidc';
import { sessions } from '../../../db/schema/sessions';
import { users } from '../../../db/schema/users';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const db = useDb((event.context.cloudflare.env as any));

  try {
    const body = await readBody(event);

    // Validate required parameters for authorization_code grant
    if (body.grant_type !== 'authorization_code') {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'unsupported_grant_type'
      }));
    }

    const { code, client_id, code_verifier, redirect_uri } = body;

    if (!code || !client_id || !code_verifier || !redirect_uri) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_request'
      }));
    }

    // Find and validate authorization code
    const [authCode] = await db
      .select()
      .from(sdchiAuthorizationCodes)
      .where(eq(sdchiAuthorizationCodes.id, code))
      .limit(1);

    if (!authCode) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_grant'
      }));
    }

    // Check if code is expired or already used
    if (authCode.expiresAt < new Date() || authCode.used) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_grant'
      }));
    }

    // Get the auth request to verify PKCE challenge
    const [authRequest] = await db
      .select()
      .from(sdchiAuthRequests)
      .where(eq(sdchiAuthRequests.id, authCode.authRequestId))
      .limit(1);

    if (!authRequest) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_grant'
      }));
    }

    // Verify client_id matches
    if (authRequest.clientId !== client_id) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_client'
      }));
    }

    // Verify redirect_uri matches
    if (authRequest.redirectUri !== redirect_uri) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_grant'
      }));
    }

    // Verify PKCE challenge
    if (authRequest.challengeMethod === 'S256') {
      const computedChallenge = createHash('sha256')
        .update(code_verifier)
        .digest('base64url');

      if (computedChallenge !== authRequest.challenge) {
        return sendError(event, createError({
          statusCode: 400,
          statusMessage: 'invalid_grant'
        }));
      }
    } else {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_request'
      }));
    }

    // Get client configuration for token signing
    const [client] = await db
      .select()
      .from(sdchiClients)
      .where(eq(sdchiClients.id, client_id))
      .limit(1);

    if (!client) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_client'
      }));
    }

    // Get user and session information
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, authCode.userId))
      .limit(1);

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, authCode.sessionId))
      .limit(1);

    if (!user || !session) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'invalid_grant'
      }));
    }

    // Mark authorization code as used
    await db
      .update(sdchiAuthorizationCodes)
      .set({ used: true })
      .where(eq(sdchiAuthorizationCodes.id, code));

    // Generate tokens
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = now + 3600; // 1 hour
    const idTokenExpiry = now + 3600; // 1 hour

    // Create access token
    const config = useRuntimeConfig();
    const baseUrl = config.baseUrl || event.context.cloudflare.env.BASE_URL;
    
    const accessToken = jwt.sign({
      iss: baseUrl,
      sub: user.id,
      aud: client_id,
      exp: accessTokenExpiry,
      iat: now,
      scope: authRequest.scope,
      client_id: client_id,
    }, client.tokenSecret, { algorithm: 'HS256' });

    // Create ID token with user claims (consistent profile structure)
    const idToken = jwt.sign({
      iss: baseUrl,
      sub: user.id,
      aud: client_id,
      exp: idTokenExpiry,
      iat: now,
      auth_time: Math.floor(session.createdAt.getTime() / 1000),
      email: user.email,
      email_verified: user.emailVerified,
      // Note: Additional profile fields (name, picture, locale) would need to be added to users schema
      // for full OIDC compliance. Current implementation provides basic required claims.
    }, client.tokenSecret, { algorithm: 'HS256' });

    // Return token response
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      id_token: idToken,
      scope: authRequest.scope,
    };

  } catch (e) {
    console.error('Token endpoint error:', e);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'server_error'
    }));
  }
});