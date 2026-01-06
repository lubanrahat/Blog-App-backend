import http from "http";
import { env } from "./app/config/env";
import createApp from "./app/app";
import { logger } from "./app/lib/logger";

function main() {
  try {
    const PORT: number = +(env?.PORT ?? 8080);
    const server = http.createServer(createApp());
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Erorr starting server", error);
  }
}

main();
