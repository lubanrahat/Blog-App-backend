import express, { type Application } from "express";
import registerHealthRoutes from "./modules/health/health.routes";
import cors from "cors";
import { env } from "./config/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import registerPostRoutes from "./modules/post/post.routes";
import registerCommentRoutes from "./modules/comment/comment.routes";

function createApp(): Application {
  const app: Application = express();

  app.use(
    cors({
      origin: env?.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/health", registerHealthRoutes());
  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use("/api/v1/post", registerPostRoutes());
  app.use("/api/v1/comment", registerCommentRoutes());

  return app;
}

export default createApp;
