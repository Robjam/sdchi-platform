import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { timestamps } from './common';
import { idpAuthRequests } from './oidc';
import { sql } from 'drizzle-orm';

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // Session ID, typically a UUID

  // User association
  userId: text('user_id').notNull().references(() => users.id),

  // Authentication source
  authSource: text('auth_source').notNull().default('sdchi-auth'), // e.g., 'google', 'line', 'github'
  idpAuthRequestId: text('idp_auth_request_id').references(() => idpAuthRequests.id),

  // Session metadata
  userAgent: text('user_agent'), // Browser/client info
  ipAddress: text('ip_address'), // IP address for audit purposes

  // Session state
  active: integer('active', { mode: 'boolean' }).notNull().default(true),

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
  userIdIdx: index('idx_sessions_user_id').on(table.userId),

  // Index for expiration cleanup
  expiresAtIdx: uniqueIndex('idx_sessions_expires_at').on(table.expiresAt)
}));