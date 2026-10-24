import { createMigrationPool } from "./db/migration-client.js";

export async function handler(): Promise<void> {
  const pool = await createMigrationPool();

  try {
    // この接続では参照専用のSQLのみを許可する
    const client = await pool.connect();

    try {
      await client.query("BEGIN READ ONLY");

      // publicスキーマに存在するテーブルを確認
      const tables = await client.query<{ table_name: string }>(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      console.info(
        "publicスキーマのテーブル一覧:",
        tables.rows.map((row) => row.table_name),
      );

      // Drizzleのマイグレーション履歴テーブルが存在するか確認
      const historyTable = await client.query<{ exists: boolean }>(`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'drizzle'
            AND table_name = '__drizzle_migrations'
        ) AS exists
      `);

      const exists = historyTable.rows[0]?.exists ?? false;

      console.info("Drizzleマイグレーション履歴テーブル:", exists);

      if (exists) {
        const history = await client.query<{
          id: number;
          hash: string;
          created_at: string;
        }>(`
          SELECT id, hash, created_at
          FROM drizzle.__drizzle_migrations
          ORDER BY id
        `);

        console.info("適用済みマイグレーション:", history.rows);
      }

      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}