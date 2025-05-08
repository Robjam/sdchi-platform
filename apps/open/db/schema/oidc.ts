import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './common';
import { users } from './users';

export const idpAuthRequests = sqliteTable('idp_auth_requests', {
  id: text('id').primaryKey(), // UUID
  providerId: text('provider_id').notNull().default('sdchi-auth'),
  redirectUri: text('redirect_uri').notNull(), // Where to return after auth
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
}, (table) => ({
  // Index for quick lookups by provider and status
  providerStatusIdx: index('idx_idp_auth_requests_provider_status').on(table.providerId, table.status),
  // Index for quick lookups by user
  userIdIdx: index('idx_idp_auth_requests_user_id').on(table.userId),
  // Index for expiration cleanup
  expiresAtIdx: index('idx_idp_auth_requests_expires_at').on(table.expiresAt),
}));
