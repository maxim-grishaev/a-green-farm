import { NextFunction, Response } from "express";
import { DataSource } from "typeorm";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { CreateUserOutputDto } from "./dto/create-user.output.dto";
import { UsersService } from "./users.service";
import { ValidatedBody } from "../../helpers/req";
import { respondWithSchema } from "../../helpers/utils";

export class UsersController {
  constructor(ds: DataSource, private readonly usersService = new UsersService(ds)) {}

  public async create(req: ValidatedBody<CreateUserInputDto>, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUser(req.body);
      respondWithSchema(res, new CreateUserOutputDto(user));
    } catch (error) {
      next(error);
    }
  }
}
