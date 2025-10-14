import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const signups = sqliteTable('signups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 255 }),
  company: text('company', { length: 255 }),
  email: text('email', { length: 255 }).notNull().unique(),
  source: text('source', { length: 100 }),
  service: text('service', { length: 100 }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  isBotFlagged: integer('is_bot_flagged', { mode: 'boolean' }).default(false).notNull(),
  canaryFieldTouched: integer('canary_field_touched', { mode: 'boolean' }).default(false).notNull()
})

export type Signup = typeof signups.$inferSelect
export type NewSignup = typeof signups.$inferInsert