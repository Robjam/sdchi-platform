import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
  },
};
