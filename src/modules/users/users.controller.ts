import { NextFunction, Response } from "express";
import { instanceToPlain } from "class-transformer";
import { DataSource } from "typeorm";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { CreateUserOutputDto } from "./dto/create-user.output.dto";
import { UsersService } from "./users.service";
import { ValidatedBody } from "../../helpers/req";

export class UsersController {
  constructor(ds: DataSource, private readonly usersService = new UsersService(ds)) {}

  public async create(req: ValidatedBody<CreateUserInputDto>, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(201).send(instanceToPlain(new CreateUserOutputDto(user), { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  }
}
