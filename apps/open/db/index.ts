import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}
export const useDb = (env: Env) => drizzle(env.DB, {
  casing: 'snake_case'
});
