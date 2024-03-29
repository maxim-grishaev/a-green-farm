import { NextFunction, Response } from "express";
import { FarmsService } from "./farms.service";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { CreateFarmOutputDto } from "./dto/create-farm.output.dto";
import { instanceToPlain } from "class-transformer";
import { DataSource } from "typeorm";
import { RequestWithUser } from "../../middlewares/auth.middleware";
import { ValidatedBody } from "../../helpers/req";

export class FarmsController {
  constructor(ds: DataSource, private readonly farmsService = new FarmsService(ds)) {}

  public async create(req: ValidatedBody<CreateFarmInputDto, RequestWithUser>, res: Response, next: NextFunction) {
    try {
      const farm = await this.farmsService.createFarm({
        name: req.body.name,
        size: req.body.size,
        yield: req.body.yield,
        user: req.user,
      });

      res.status(201).send(instanceToPlain(new CreateFarmOutputDto(farm)));
    } catch (error) {
      next(error);
    }
  }
}
