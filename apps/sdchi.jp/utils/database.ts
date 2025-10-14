import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../drizzle/schema'

export function getDatabase(env: any) {
  console.log(env)
  if (!env?.DB) {
    throw new Error('Database binding not found. Make sure D1 database is properly configured.')
  }

  return drizzle(env.DB, { schema })
}

export type Database = ReturnType<typeof getDatabase>