import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { timestamps } from './common';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  providerId: text('provider_id').notNull().default('sdchi-auth'), // Which OAuth provider (e.g., 'line', 'google')
  providerSub: text('provider_sub').notNull(), // The 'sub' claim from the provider
  status: text('status').notNull().default('active'), // created, onboarded, delinquent, suspended, deactivated
  email: text('email'), // Optional - not all providers guarantee email
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  name: text('name'),
  picture: text('picture'), // Profile image URL
  locale: text('locale'),
  ...timestamps,
}, (table) => ({
  providerIdx: index('provider_idx').on(table.providerId, table.providerSub),
}));
