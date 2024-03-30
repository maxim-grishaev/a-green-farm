import { Router } from "express";
import { createAuthRouter } from "./auth.routes";
import { createUsersRouter } from "./user.routes";
import { createFarmRouter } from "./farm.routes";
import { DataSource } from "typeorm";

export const createRoutes = async (ds: DataSource) => {
  const routes = Router();
  routes.use("/auth", createAuthRouter(ds));
  routes.use("/users", createUsersRouter(ds));
  routes.use("/farms", await createFarmRouter(ds));
  return routes;
};
