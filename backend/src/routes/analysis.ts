import { Hono } from "hono";
import { analysisRequestSchema } from "../schemas/analysis";
import { analyzeCommunication } from "../services/analysis";

const analysis = new Hono();

analysis.post("/", async (c) => {
  // リクエストボディをJSONとして読み取る
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        error: "JSON形式が正しくありません",
      },
      400,
    );
  }

  // リクエスト内容が分析APIの入力ルールを満たしているか検証する
  const result = analysisRequestSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: "入力内容が正しくありません",
        details: result.error.flatten().fieldErrors,
      },
      400,
    );
  }

  try {
    // 検証済みの入力内容を使ってBedrockで分析する
    const analysisResult = await analyzeCommunication(result.data);

    return c.json(analysisResult);
  } catch (error) {
    console.error("アサーション分析に失敗しました:", error);

    return c.json(
      {
        error: "分析処理中にエラーが発生しました",
      },
      500,
    );
  }
});

export default analysis;