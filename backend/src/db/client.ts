import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

// 環境変数からPostgreSQLの接続情報を取得
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URLが設定されていません');
}

// PostgreSQLへの接続プールを作成
const pool = new Pool({
  connectionString: databaseUrl,
});

// Drizzle ORMからDBを操作できるようにする
export const db = drizzle(pool, { schema });