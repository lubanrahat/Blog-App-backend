import express, { type Application } from "express";
import registerHealthRoutes from "./modules/health/health.routes";
import cors from "cors";
import { env } from "./config/env";

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

  return app;
}

export default createApp;
