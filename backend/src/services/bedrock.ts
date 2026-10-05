import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Amazon Bedrock Runtimeに接続するためのクライアントを作成
const client = new BedrockRuntimeClient({
  region: "ap-northeast-1",
});

// Claude Haiku 4.5にメッセージを送り、回答を取得する

export const converseWithClaude = async (prompt: string): Promise<string> => {

  // Claudeに送信するリクエストを作成

  const command = new ConverseCommand({
    modelId: "jp.anthropic.claude-haiku-4-5-20251001-v1:0",
    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
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
