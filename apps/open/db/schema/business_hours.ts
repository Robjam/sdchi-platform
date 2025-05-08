import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { timestamps } from './common';
import { users } from './users';

export const businessHours = sqliteTable('business_hours', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Template name (e.g., "Default", "Holiday Schedule")
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  weeklyTemplate: text('weekly_template').notNull(), // JSON string of WeeklyTemplate
  ...timestamps,
}, (table) => ({
  userIdIdx: index('business_hours_user_id_idx').on(table.userId),
  userDefaultIdx: index('business_hours_user_default_idx').on(table.userId, table.isDefault),
}));