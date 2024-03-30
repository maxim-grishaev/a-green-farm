import { NextFunction, Response } from "express";
import { DataSource } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { CreateFarmOutputDto } from "./dto/create-farm.output.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "../../middlewares/auth.middleware";
import { ValidatedBody } from "../../helpers/req";
import { respondWithSchema } from "../../helpers/utils";

export class FarmsController {
  constructor(ds: DataSource, private readonly farmsService = new FarmsService(ds)) {}

  public async create(req: ValidatedBody<CreateFarmInputDto, RequestWithUser>, res: Response, next: NextFunction) {
    try {
      const farm = await this.farmsService.createFarm(req.body, req.user);
      respondWithSchema(res, new CreateFarmOutputDto(farm));
    } catch (error) {
      next(error);
    }
  }
}
