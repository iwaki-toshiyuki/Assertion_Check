// AWS Lambda（API Gateway経由）用エントリーポイント
import { handle } from "hono/aws-lambda";
import { app } from "./app";

export const handler = handle(app);
