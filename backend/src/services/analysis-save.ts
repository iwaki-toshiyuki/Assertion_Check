import { db } from "../db/client.js";
import { records, analysisResults } from "../db/schema.js";
import { analysisResponseSchema } from "../schemas/analysis.js";
import { z } from "zod";

// AI分析結果の型をZodスキーマから取得する
type AnalysisResult = z.infer<typeof analysisResponseSchema>;

type SaveAnalysisInput = {
  userId: number;
  situation: string;
  response: string;
  analysisResult: AnalysisResult;
};

// 分析内容と分析結果をトランザクションで保存する
export async function saveAnalysis({
  userId,
  situation,
  response,
  analysisResult,
}: SaveAnalysisInput) {
  return db.transaction(async (tx) => {
    // ユーザーが入力した分析内容を保存する
    const [record] = await tx
      .insert(records)
      .values({
        userId,
        situation,
        response,
      })
      .returning();

    if (!record) {
      throw new Error("分析内容の保存に失敗しました");
    }

    // AIによる分析結果を保存する
    const [savedResult] = await tx
      .insert(analysisResults)
      .values({
        recordId: record.id,
        assertiveScore: analysisResult.assertive,
        aggressiveScore: analysisResult.aggressive,
        nonAssertiveScore: analysisResult.nonAssertive,
        feedback: analysisResult.feedback,
        improvement: analysisResult.suggestion,
      })
      .returning();

    if (!savedResult) {
      throw new Error("分析結果の保存に失敗しました");
    }

    // 両方の保存に成功した場合のみ確定する
    return {
      record,
      analysisResult: savedResult,
    };
  });
}