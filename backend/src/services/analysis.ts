import { analysisResponseSchema } from "../schemas/analysis";
import { converseWithClaude } from "./bedrock";

type AnalysisInput = {
  situation: string;
  response: string;
};

// 入力内容からアサーティブ・コミュニケーションの分析を行う
export const analyzeCommunication = async ({
  situation,
  response,
}: AnalysisInput) => {
  const prompt = `
あなたはアサーティブ・コミュニケーションの分析を行うアシスタントです。

以下の「困った場面」と「そのとき取った対応」をもとに、
ユーザーの対応を分析してください。

【困った場面】
${situation}

【そのとき取った対応】
${response}

以下の基準で分析してください。

- assertive: アサーティブの割合
- aggressive: アグレッシブの割合
- nonAssertive: ノンアサーティブの割合
- feedback: 対応についてのフィードバック
- suggestion: よりアサーティブな対応にするための改善例

3つの割合の合計は必ず100にしてください。

回答は以下のJSON形式のみで返してください。
Markdownやコードブロック、JSON以外の文章は含めないでください。

{
  "assertive": 0,
  "aggressive": 0,
  "nonAssertive": 0,
  "feedback": "フィードバック",
  "suggestion": "改善例"
}
`;

  // BedrockからClaudeの分析結果を文字列として取得する
  const responseText = await converseWithClaude(prompt);

  // コードブロックが含まれていてもJSONとして扱えるように除去する
  const jsonText = responseText
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Claudeから返された文字列をJSONオブジェクトへ変換する
  const parsedResponse: unknown = JSON.parse(jsonText);

  // 想定した分析結果の形式になっているか検証する
  return analysisResponseSchema.parse(parsedResponse);
};