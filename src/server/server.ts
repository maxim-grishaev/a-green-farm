import swaggerDocs from "config/swagger-config";
import express, { Express } from "express";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import { createRoutes } from "routes";
import { DataSource } from "typeorm";

export function setupServer(ds: DataSource): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", createRoutes(ds));

  app.use(handleErrorMiddleware);

  swaggerDocs(app);
  return app;
}
