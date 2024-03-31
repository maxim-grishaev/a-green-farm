import { Router } from "express";
import { validateInputMiddleware } from "middlewares/validate-input.middleware";
import { AuthController } from "modules/auth/auth.controller";
import { LoginUserInputDto } from "modules/auth/dto/login-user.input.dto";
import { DataSource } from "typeorm";
import { asAsyncRoute } from "../helpers/asAsyncMiddleware";

export const createAuthRouter = (ds: DataSource) => {
  const router = Router();
  const authController = new AuthController(ds);

  /**
   * @openapi
   * '/api/auth/login':
   *  post:
   *     tags:
   *       - Auth
   *     summary: Authenticate user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/LoginUserInputDto'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginUserOutputDto'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   *      422:
   *        description: Unprocessable Entity
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   */
  router.post(
    "/login",
    validateInputMiddleware(LoginUserInputDto),
    asAsyncRoute(req => authController.login(req)),
  );

  return router;
};
