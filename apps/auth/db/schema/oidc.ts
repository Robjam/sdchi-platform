import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { timestamps } from './common';
import { users } from './users';
import { sessions } from './sessions';

// OIDC providers configuration
export const idps = sqliteTable('idps', {
  id: text('id').primaryKey(), // e.g. 'google', 'github'
  clientId: text('client_id').notNull(),
  clientSecret: text('client_secret').notNull(),
  discoveryUrl: text('discovery_url'),
  authorizationUrl: text('authorization_url'), // Optional, for non-discovery providers
  tokenUrl: text('token_url'), // Optional, for non-discovery providers
  userInfoUrl: text('user_info_url'), // Optional, for non-discovery providers
  scopes: text('scopes').notNull(),
  ...timestamps
}, (table) => ({
  unqProviderId: uniqueIndex('unq_provider_id').on(table.id)
}));

export const idpProviderClients = sqliteTable('idp_sdchi_clients', {
  id: text('id').primaryKey(), // uuid
  providerId: text('provider_id').notNull().references(() => idps.id),
  sdchiClientId: text('sdchi_client_id').notNull().references(() => sdchiClients.id),
  ...timestamps,
});

// Registered OIDC clients for web-app-a
export const sdchiClients = sqliteTable('sdchi_clients', {
  id: text('id').primaryKey(), // client_id from web-app-a
  applicationName: text('application_name').notNull(), // e.g. 'web-app-a'
  redirectUris: text('redirect_uris').notNull(), // JSON array
  allowedLogoutRedirectUris: text('allowed_logout_redirect_uris'), // JSON array of allowed logout redirect URIs
  tokenSecret: text('token_secret').notNull(), // HS256 secret for client assertions
  ...timestamps
});

// sdchi web app ⇆ auth server (this server)
export const sdchiAuthRequests = sqliteTable('sdchi_auth_requests', {
  id: text('id').primaryKey(), // UUID
  clientId: text('client_id').notNull().references(() => sdchiClients.id),
  redirectUri: text('redirect_uri').notNull(), // redirect_uri from authorization request
  responseType: text('response_type').notNull(), // Usually "code"
  state: text('state').notNull(), // state parameter to prevent CSRF
  challenge: text('challenge').notNull(), // S256 hashed code verifier
  challengeMethod: text('challenge_method').notNull(), // 'S256'
  scope: text('scope').notNull(),
  status: text('status').notNull().default('initiated'), // initiated, idp_selected, completed, error
  error: text('error'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ...timestamps
});

export const idpAuthRequests = sqliteTable('idp_auth_requests', {
  id: text('id').primaryKey(), // UUID
  providerId: text('provider_id').notNull().references(() => idps.id),
  authRequestId: text('auth_request_id').notNull().references(() => sdchiAuthRequests.id),
  redirectUri: text('redirect_uri').notNull(), // redirect_uri back to auth server
  state: text('state').notNull(), // state parameter to prevent CSRF
  nonce: text('nonce').notNull(), // nonce parameter to prevent replay attacks
  codeVerifier: text('code_verifier').notNull(), // Original code verifier
  challenge: text('challenge').notNull(), // S256 hashed code verifier
  challengeMethod: text('challenge_method').notNull(), // 'S256'
  scopes: text('scopes').notNull(), // requested scopes
  status: text('status').notNull().default('initiated'), // initiated, redirected, completed, error
  authCode: text('auth_code'), // Auth code received from IdP
  userId: text('user_id').references(() => users.id), // Set after user is identified
  error: text('error'), // error message if any
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ...timestamps,
});

// Authorization codes issued to SDCHI clients
export const sdchiAuthorizationCodes = sqliteTable('sdchi_authorization_codes', {
  id: text('id').primaryKey(), // The authorization code itself
  authRequestId: text('auth_request_id').notNull().references(() => sdchiAuthRequests.id),
  userId: text('user_id').notNull().references(() => users.id),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ...timestamps,
});
