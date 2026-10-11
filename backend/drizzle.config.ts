import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // マイグレーションファイルの出力先
  out: './drizzle',

  // テーブル定義ファイルの場所
  schema: './src/db/schema.ts',

  // 使用するデータベース
  dialect: 'postgresql',

  // 環境変数からDB接続情報を取得
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});