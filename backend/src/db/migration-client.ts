import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { getDbCredentials } from "./secrets.js";

// マイグレーション専用のDB接続を作成する
export async function createMigrationPool(): Promise<Pool> {
  const { username, password } = await getDbCredentials();

  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT ?? 5432);
  const database = process.env.DB_NAME;

  if (!host || !database) {
    throw new Error("DB_HOSTまたはDB_NAMEが設定されていません");
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORTが不正です");
  }

  // RDSのCA証明書を読み込む
  const ca = readFileSync(
    "/var/task/certs/ap-northeast-1-bundle.pem",
    "utf8"
  );

  return new Pool({
    host,
    port,
    database,
    user: username,
    password,

    // SSL/TLSで暗号化し、RDSのサーバー証明書を検証する
    ssl: {
      ca,
      rejectUnauthorized: true,
    },

    // マイグレーションは単独実行するため、接続数を最小限にする
    max: 1,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
}