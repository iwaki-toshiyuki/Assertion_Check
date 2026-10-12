import { desc, eq } from "drizzle-orm";
import { db } from "./client.js";
import { records, analysisResults } from "./schema.js";

// 指定したユーザーの分析履歴を新しい順に取得する
export async function findRecordsByUserId(userId: number) {
  return db
    .select({
      id: records.id,
      situation: records.situation,
      response: records.response,
      createdAt: records.createdAt,
      assertiveScore: analysisResults.assertiveScore,
      aggressiveScore: analysisResults.aggressiveScore,
      nonAssertiveScore: analysisResults.nonAssertiveScore,
    })
    .from(records)
    .innerJoin(
      analysisResults,
      eq(records.id, analysisResults.recordId),
    )
    .where(eq(records.userId, userId))
    .orderBy(desc(records.createdAt), desc(records.id));
}