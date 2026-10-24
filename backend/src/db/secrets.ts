import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { z } from "zod";

// Secrets Managerに保存されているDB認証情報の形式
const dbSecretSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION ?? "ap-northeast-1",
});

// Secrets ManagerからDB認証情報を取得する
export async function getDbCredentials() {
  const secretArn = process.env.DB_SECRET_ARN;

  if (!secretArn) {
    throw new Error("DB_SECRET_ARNが設定されていません");
  }

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretArn,
    }),
  );

  if (!response.SecretString) {
    throw new Error("DB認証情報を取得できませんでした");
  }

  // 取得したJSONの形式を検証する
  const secret = JSON.parse(response.SecretString);

  return dbSecretSchema.parse(secret);
}