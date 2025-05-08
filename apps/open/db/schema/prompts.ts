import { index, sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";
import { timestamps } from "./common";
import { users } from "./users";

export const prompts = sqliteTable('prompts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  // current rating is a 1-5 scale, but the rating timing is variable/optional so the default is 0
  rating: numeric('rating', { mode: 'number' }).default(0),
  ...timestamps,
}, (table) => ({
  userIdIdx: index('idx_prompts_user_id').on(table.userId),

  promptIdx: index('idx_prompts_prompt').on(table.prompt),

  responseIdx: index('idx_prompts_response').on(table.response),
}));