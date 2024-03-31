import { Router } from "express";
import { validateInputMiddleware } from "middlewares/validate-input.middleware";
import { CreateUserInputDto } from "modules/users/dto/create-user.input.dto";
import { UsersController } from "modules/users/users.controller";
import { DataSource } from "typeorm";
import { asAsyncRoute } from "../helpers/asAsyncMiddleware";

export const createUsersRouter = (ds: DataSource) => {
  const router = Router();
  const usersController = new UsersController(ds);

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *       - User
   *     summary: Create a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInputDto'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserOutputDto'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   *      422:
   *        description: User with the same email already exists
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   */
  router.post(
    "/",
    validateInputMiddleware(CreateUserInputDto),
    asAsyncRoute(req => usersController.create(req)),
  );
  return router;
};
