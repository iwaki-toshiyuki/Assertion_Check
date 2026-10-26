import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { records, analysisResults } from "./schema.js";


// 指定したユーザーの分析履歴をページ単位で取得する
export async function findRecordsByUserId(
  userId: number,
  page: number,
  limit: number,
) {
  const db = await getDb();

  // 取得開始位置を計算する
  const offset = (page - 1) * limit;

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
    .orderBy(desc(records.createdAt), desc(records.id))
    .limit(limit)
    .offset(offset);
}

// 指定したユーザーが所有する分析履歴の詳細を取得する
export async function findRecordByIdAndUserId(
  recordId: number,
  userId: number,
) {
  const db = await getDb();

  const [record] = await db
    .select({
      id: records.id,
      situation: records.situation,
      response: records.response,
      createdAt: records.createdAt,
      assertiveScore: analysisResults.assertiveScore,
      aggressiveScore: analysisResults.aggressiveScore,
      nonAssertiveScore: analysisResults.nonAssertiveScore,
      feedback: analysisResults.feedback,
      improvement: analysisResults.improvement,
    })
    .from(records)
    .innerJoin(
      analysisResults,
      eq(records.id, analysisResults.recordId),
    )
    // 履歴IDだけでなく、所有者のユーザーIDも条件に含める
    .where(
      and(
        eq(records.id, recordId),
        eq(records.userId, userId),
      ),
    )
    .limit(1);

  return record;
}

// 指定したユーザーの分析履歴の総件数を取得する
export async function countRecordsByUserId(userId: number) {
  const db = await getDb();

  const [result] = await db
    .select({
      total: count(),
    })
    .from(records)
    .innerJoin(
      analysisResults,
      eq(records.id, analysisResults.recordId),
    )
    .where(eq(records.userId, userId));

  return result.total;
}
