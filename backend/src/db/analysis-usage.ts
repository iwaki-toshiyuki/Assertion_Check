import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "./client.js";
import { analysisUsage, users } from "./schema.js";

// 1ユーザーが1日に実行できるAI分析の最大回数
const DAILY_ANALYSIS_LIMIT = 10;

// 日本時間（JST）の今日の開始・終了日時をUTCで取得する
function getTodayRangeInJst() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const start = new Date(`${today}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}

// 指定ユーザーの本日の利用回数を取得する
async function countTodayUsage(
  database: Pick<typeof db, "select">,
  userId: number,
): Promise<number> {
  const { start, end } = getTodayRangeInJst();

  const result = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(analysisUsage)
    .where(
      and(
        eq(analysisUsage.userId, userId),
        gte(analysisUsage.createdAt, start),
        lt(analysisUsage.createdAt, end),
      ),
    );

  return result[0]?.count ?? 0;
}

// AI分析の実行枠を1回分確保する
// 同じユーザーの同時リクエストを行ロックで順番に処理する
export async function consumeAnalysisQuota(
  userId: number,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    // 対象ユーザーの行をロックする
    await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .for("update");

    // 本日の利用回数を取得する
    const usedCount = await countTodayUsage(tx, userId);

    if (usedCount >= DAILY_ANALYSIS_LIMIT) {
      return false;
    }

    // AI分析の実行枠を確保した履歴を追加する
    await tx.insert(analysisUsage).values({
      userId,
    });

    return true;
  });
}

// 指定ユーザーの本日の分析利用状況を取得する
// 利用状況の確認だけなので、分析回数は加算しない
export async function getAnalysisUsage(userId: number) {
  const usedCount = await countTodayUsage(db, userId);

  return {
    dailyLimit: DAILY_ANALYSIS_LIMIT,
    usedCount,
    remainingCount: Math.max(0, DAILY_ANALYSIS_LIMIT - usedCount),
  };
}