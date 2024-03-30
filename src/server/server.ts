import swaggerDocs from "config/swagger-config";
import express, { Express } from "express";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import { createRoutes } from "routes";
import { DataSource } from "typeorm";

export const setupServer = async (ds: DataSource): Promise<Express> => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await ds.initialize();
  app.use("/api", await createRoutes(ds));
  app.use(handleErrorMiddleware);

  swaggerDocs(app);
  return app;
};
