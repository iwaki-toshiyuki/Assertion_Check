import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";
import { health } from "./routes/health";
import analysis from "./routes/analysis";

export const app = new Hono();

app.use(logger());
app.use(cors({ origin: env.corsOrigin }));

app.route("/health", health);

app.route("/api/analysis", analysis);
