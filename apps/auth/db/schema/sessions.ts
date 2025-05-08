import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { timestamps } from './common';

import { sql } from 'drizzle-orm';
import { idpAuthRequests, sdchiAuthRequests } from './oidc';

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // Session ID, typically a UUID

  // User association
  userId: text('user_id').notNull().references(() => users.id),

  // Authentication source
  authSource: text('auth_source').notNull(), // e.g., 'google', 'line', 'github'
  sdchiAuthRequestId: text('sdchi_auth_request_id').references(() => sdchiAuthRequests.id),
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

// For multi-device session management
export const sessionDevices = sqliteTable('session_devices', {
  id: text('id').primaryKey(),

  // Session association
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),

  // Device information
  deviceId: text('device_id'), // Client-provided device ID or fingerprint
  deviceType: text('device_type'), // 'mobile', 'desktop', 'tablet', etc.
  deviceName: text('device_name'), // User-friendly name, e.g., "John's iPhone"
  deviceModel: text('device_model'), // More detailed device info

  // OS/platform information
  osName: text('os_name'), // 'iOS', 'Android', 'Windows', etc.
  osVersion: text('os_version'),

  // Browser information
  browserName: text('browser_name'),
  browserVersion: text('browser_version'),

  // Last seen info
  lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastSeenIp: text('last_seen_ip'),

  // Timestamps
  ...timestamps
});

// For audit/security purposes
export const sessionActivities = sqliteTable('session_activities', {
  id: text('id').primaryKey(),

  // Session association
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),

  // Activity information
  activityType: text('activity_type').notNull(), // 'login', 'logout', 'token_refresh', 'permission_change', etc.
  description: text('description'),

  // Context information
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  location: text('location'), // Optional geolocation info

  // Result
  successful: integer('successful', { mode: 'boolean' }).notNull(),
  failureReason: text('failure_reason'),

  // Timestamp
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});