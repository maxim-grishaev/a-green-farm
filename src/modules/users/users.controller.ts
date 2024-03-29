import { NextFunction, Request, Response } from "express";
import { CreateUserOutputDto } from "./dto/create-user.output.dto";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { UsersService } from "./users.service";
import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";

export class UsersController {
  private readonly usersService: UsersService;

  constructor(ds: DataSource) {
    this.usersService = new UsersService(ds);
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUser(req.body as CreateUserInputDto);

      res.status(201).send(plainToInstance(CreateUserOutputDto, user, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  }
}
