import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { timestamps } from './common';
import { idps } from './oidc';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  providerId: text('provider_id').notNull().references(() => idps.id), // Which OAuth provider (e.g., 'line', 'google')
  providerSub: text('provider_sub').notNull(), // The 'sub' claim from the provider
  email: text('email'), // Optional - not all providers guarantee email
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  ...timestamps,
}, (table) => ({
  providerIdx: index('provider_idx').on(table.providerId, table.providerSub),
}));
