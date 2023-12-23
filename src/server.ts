import { Server } from "http";
import app from "./app";
import config from "./config";

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      console.log(
        "Unhandled Rejection is detected, we are closing our server....."
      );
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.log("Uncaught Exception is detected", error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    console.log("SIGTERM is received");
    if (server) {
      server.close();
    }
  });
}

bootstrap();
