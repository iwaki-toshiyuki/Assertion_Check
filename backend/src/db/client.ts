import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import { getDbCredentials } from "./secrets.js";
import { readFileSync } from "node:fs";

// DrizzleのDBインスタンスの型
type Database = ReturnType<typeof drizzle<typeof schema>>;

// Lambdaの実行環境内でDB接続を再利用する
let dbPromise: Promise<Database> | undefined;

// DB接続を初期化する
async function createDb(): Promise<Database> {
  const databaseUrl = process.env.DATABASE_URL;

  // ローカル環境では従来のDATABASE_URLを使用する
  if (databaseUrl) {
    const pool = new Pool({
      connectionString: databaseUrl,
    });

    return drizzle(pool, { schema });
  }

  // AWS本番環境ではSecrets Managerから認証情報を取得する
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

  // RDSのCA証明書を読み込み、接続先の証明書を検証する
  const ca = readFileSync(
    "/var/task/certs/ap-northeast-1-bundle.pem",
    "utf8"
  );

  const pool = new Pool({
    host,
    port,
    database,
    user: username,
    password,

    // RDSへの通信を暗号化し、サーバー証明書を検証する
    ssl: {
      ca,
      rejectUnauthorized: true,
    },

    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  return drizzle(pool, { schema });
}

// 初期化済みのDB接続を再利用する
export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = createDb().catch((error: unknown) => {
      // 初期化に失敗した場合は、次回リクエストで再試行できるようにする
      dbPromise = undefined;
      throw error;
    });
  }

  return dbPromise;
}