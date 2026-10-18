import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "./client.js";
import { analysisUsage } from "./schema.js";

// 1ユーザーが1日に実行できるAI分析の最大回数
const DAILY_ANALYSIS_LIMIT = 10;

// 日本時間（JST）の今日の日付をYYYY-MM-DD形式で取得する
function getTodayInJst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// AI分析の実行枠を1回分確保する
// 同時リクエストでも上限を超えないよう、DB側で原子的に更新する
export async function consumeAnalysisQuota(
  userId: number,
): Promise<boolean> {
  const today = getTodayInJst();

  const result = await db
    .insert(analysisUsage)
    .values({
      userId,
      usageDate: today,
      requestCount: 1,
    })
    .onConflictDoUpdate({
      target: [analysisUsage.userId, analysisUsage.usageDate],

      // 既存の利用回数に1を加算する
      set: {
        requestCount: sql`${analysisUsage.requestCount} + 1`,
        updatedAt: new Date(),
      },

      // 10回未満の場合だけ更新を許可する
      setWhere: and(
        eq(analysisUsage.userId, userId),
        lt(analysisUsage.requestCount, DAILY_ANALYSIS_LIMIT),
      ),
    })
    .returning({ requestCount: analysisUsage.requestCount });

  // 更新対象がなければ、1日の利用上限に達している
  return result.length > 0;
}

// 指定ユーザーの本日の分析利用状況を取得する
// 利用状況の確認だけなので、分析回数は加算しない
export async function getAnalysisUsage(userId: number) {
  const today = getTodayInJst();

  const result = await db
    .select({
      requestCount: analysisUsage.requestCount,
    })
    .from(analysisUsage)
    .where(
      and(
        eq(analysisUsage.userId, userId),
        eq(analysisUsage.usageDate, today),
      ),
    )
    .limit(1);

  // 本日まだ分析していない場合は0回として扱う
  const usedCount = result[0]?.requestCount ?? 0;

  return {
    dailyLimit: DAILY_ANALYSIS_LIMIT,
    usedCount,
    remainingCount: Math.max(0, DAILY_ANALYSIS_LIMIT - usedCount),
  };
}