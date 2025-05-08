import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { timestamps } from "./common";
import { sql } from "drizzle-orm";

export const portalAdmins = sqliteTable('portal_admins', {
  id: text('id').primaryKey(),
  providerId: text('provider_id').notNull(), // Which OAuth provider (e.g., 'line', 'google')
  providerSub: text('provider_sub').notNull(), // The 'sub' claim from the provider
  email: text('email'), // Optional - not all providers guarantee email
  ...timestamps,
}, (table) => ({
}));

// Authorization codes issued to SDCHI-auth portal
export const portalAuthRequests = sqliteTable('portal_auth_requests', {
  id: text('id').primaryKey(), // UUID
  clientId: text('client_id').notNull(),
  redirectUri: text('redirect_uri').notNull(), // redirect_uri from authorization request
  responseType: text('response_type').notNull(), // Usually "code"
  state: text('state').notNull(), // state parameter to prevent CSRF
  nonce: text('nonce').notNull(), // nonce parameter to prevent replay attacks
  codeVerifier: text('code_verifier').notNull(), // Original code verifier for PKCE
  challenge: text('challenge').notNull(), // S256 hashed code verifier
  challengeMethod: text('challenge_method').notNull(), // 'S256'
  scope: text('scope').notNull(),
  status: text('status').notNull().default('initiated'), // initiated, idp_selected, completed, error
  error: text('error'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ...timestamps,
});

export const portalSessions = sqliteTable('portal_sessions', {
  id: text('id').primaryKey(), // Session ID, typically a UUID

  // User association
  userId: text('user_id').notNull().references(() => portalAdmins.id),

  // Authentication source
  authSource: text('auth_source').notNull(), // e.g., 'google', 'line', 'github'
  portalAuthRequestId: text('portal_auth_request_id').references(() => portalAuthRequests.id),

  // Session metadata
  userAgent: text('user_agent'), // Browser/client info
  ipAddress: text('ip_address'), // IP address for audit purposes

  // Session state
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  
  // CSRF protection
  csrfToken: text('csrf_token'), // CSRF token for form protection

  // Tokens (consider encryption for these fields)
  accessToken: text('access_token'), // JWT access token
  refreshToken: text('refresh_token'), // For refreshing the session
  idToken: text('id_token'), // OIDC ID token

  // Token metadata
  tokenType: text('token_type').default('Bearer'),
  scope: text('scope'), // Granted scopes

  // Expiration
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),

  // Last activity
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  // Revocation
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  revokedReason: text('revoked_reason'),

  // Timestamps
  ...timestamps
}, (table) => ({
  // Index for quick lookups by user (non-unique to allow multiple sessions)
  userIdIdx: index('idx_portal_sessions_user_id').on(table.userId),

  // Index for expiration cleanup
  expiresAtIdx: uniqueIndex('idx_portal_sessions_expires_at').on(table.expiresAt)
}));
