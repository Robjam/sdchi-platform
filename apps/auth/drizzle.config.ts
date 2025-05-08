import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: '', // Placeholder for local development
    databaseId: 'd4a8939e-8ebc-4357-8b86-35b1723cb60e', // Preview DB from wrangler.toml
    token: 'dummy-token' // Placeholder for local development
  },
});
