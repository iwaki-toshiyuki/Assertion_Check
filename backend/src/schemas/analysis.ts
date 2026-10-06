import { z } from "zod";

// アサーション分析APIで受け取る入力値を検証する
export const analysisRequestSchema = z.object({
  situation: z
    .string()
    .min(1, "困った場面を入力してください")
    .max(500, "困った場面は500文字以内で入力してください"),

  response: z
    .string()
    .min(1, "そのとき取った対応を入力してください")
    .max(500, "そのとき取った対応は500文字以内で入力してください"),
});

// Bedrockから返される分析結果を検証する
export const analysisResponseSchema = z
  .object({
    assertive: z.number().min(0).max(100),
    aggressive: z.number().min(0).max(100),
    nonAssertive: z.number().min(0).max(100),
    feedback: z.string().min(1),
    suggestion: z.string().min(1),
  })
  .refine(
    (data) =>
      data.assertive + data.aggressive + data.nonAssertive === 100,
    {
      message: "分析結果の割合の合計が100ではありません",
    },
  );