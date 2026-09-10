import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set in .env.local');
}

// This sql function will be used to run queries from your API routes
export const sql = neon(process.env.DATABASE_URL);