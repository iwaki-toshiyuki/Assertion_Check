import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";
import { health } from "./routes/health";
import analysis from "./routes/analysis";
import { authMiddleware } from "./middleware/auth";

export const app = new Hono();

// 共通ミドルウェア
app.use(logger());
app.use(cors({ origin: env.corsOrigin }));

// ヘルスチェックAPI（認証不要）
app.route("/health", health);

// 分析APIにJWT認証を適用
app.use("/api/analysis", authMiddleware);

// 分析API
app.route("/api/analysis", analysis);