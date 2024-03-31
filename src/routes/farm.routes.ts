import { Router } from "express";
import { validateInputMiddleware } from "middlewares/validate-input.middleware";
import { CreateFarmInputDto } from "modules/farms/dto/create-farm.input.dto";
import { FarmsController } from "modules/farms/farms.controller";
import { DataSource } from "typeorm";
import { RequestWithUser, authMiddleware } from "../middlewares/auth.middleware";
import { QueryFarmsInputDto } from "../modules/farms/dto/query-farm.input.dto";
import { asAsyncRoute } from "../helpers/asAsyncMiddleware";

export const createFarmRouter = async (ds: DataSource) => {
  const router = Router();
  const farmsController = new FarmsController(ds);
  await farmsController.init();

  /**
   * @openapi
   * '/api/farms':
   *  post:
   *     tags:
   *       - Farm
   *     summary: Create a farm
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateFarmInputDto'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/FarmOutputDto'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   *      422:
   *        description: Farm with the same name already exists
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   */
  router.post(
    "/",
    authMiddleware(ds),
    validateInputMiddleware(CreateFarmInputDto),
    asAsyncRoute((req: RequestWithUser) => farmsController.create(req)),
  );

  /**
   * @openapi
   * '/api/farms':
   *  get:
   *     tags:
   *       - Farm
   *     summary: Query a farms list
   *     queryParameters:
   *       schema:
   *          $ref: '#/components/schemas/QueryFarmsInputDto'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/FarmOutputDto'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorOutputDto'
   */
  router.get(
    "/",
    authMiddleware(ds),
    validateInputMiddleware(QueryFarmsInputDto),
    asAsyncRoute((req: RequestWithUser) => farmsController.getFarmsListPage(req)),
  );
  return router;
};
