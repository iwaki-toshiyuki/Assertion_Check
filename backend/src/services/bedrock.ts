import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Amazon Bedrock Runtimeに接続するためのクライアントを作成
const client = new BedrockRuntimeClient({
  region: "ap-northeast-1",
});

// Claude Haiku 4.5にメッセージを送り、回答を取得する
export const converseWithClaude = async (
  systemPrompt: string,
  userPrompt: string,
): Promise<string> => {
  const command = new ConverseCommand({
    modelId:
      process.env.BEDROCK_MODEL_ID ??
      "jp.anthropic.claude-haiku-4-5-20251001-v1:0",

    // AIへの指示をSystem Promptとして設定する
    system: [
      {
        text: systemPrompt,
      },
    ],

    // ユーザー入力は分析対象のデータとして送信する
    messages: [
      {
        role: "user",
        content: [
          {
            text: userPrompt,
          },
        ],
      },
    ],
  });

  // Bedrockにリクエストを送信
  const response = await client.send(command);

  // Claudeから返されたテキストを取得
  const text = response.output?.message?.content?.[0]?.text;

  if (!text) {
    throw new Error("Claudeからレスポンスを取得できませんでした。");
  }

  return text;
};