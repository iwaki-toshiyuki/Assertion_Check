import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";
import { health } from "./routes/health";
import analysis from "./routes/analysis";
import { authMiddleware } from "./middleware/auth";
import users from "./routes/users";
import records from "./routes/records";

export const app = new Hono();

// 共通ミドルウェア
app.use(logger());
app.use(cors({ origin: env.corsOrigin }));

// ヘルスチェックAPI（認証不要）
app.route("/health", health);

// 分析APIと、その配下のAPIにJWT認証を適用
app.use("/api/analysis", authMiddleware);
app.use("/api/analysis/*", authMiddleware);

// 分析API
app.route("/api/analysis", analysis);

// ユーザー情報APIは認証済みユーザーのみ利用できる
app.use("/api/users/*", authMiddleware);
app.route("/api/users", users);

// 分析履歴APIは認証済みユーザーのみ利用できる
app.use("/api/records", authMiddleware);
app.use("/api/records/*", authMiddleware);
app.route("/api/records", records);