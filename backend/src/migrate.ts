import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createMigrationPool } from "./db/migration-client.js";

// AWS CLIから手動実行するマイグレーション専用Lambda
export async function handler(): Promise<void> {
  // 誤操作による実行を防ぐ
  if (process.env.ENABLE_DB_MIGRATION !== "true") {
    throw new Error("DBマイグレーションの実行が許可されていません");
  }

  const pool = await createMigrationPool();

  try {
    const db = drizzle(pool);

    console.info("DBマイグレーションを開始します");

    // drizzle/ 内の未適用マイグレーションを順番に実行する
    await migrate(db, {
      migrationsFolder: "/var/task/drizzle",
    });

    console.info("DBマイグレーションが正常に完了しました");
  } catch (error: unknown) {
    console.error("DBマイグレーションに失敗しました", error);
    throw error;
  } finally {
    // 成功・失敗にかかわらずDB接続を終了する
    await pool.end();
  }
}