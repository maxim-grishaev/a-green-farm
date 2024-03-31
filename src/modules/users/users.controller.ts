import { Request } from "express";
import { DataSource } from "typeorm";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { UsersService } from "./users.service";
import { asPlainUser } from "./dto/user.output.dto";

export class UsersController {
  constructor(ds: DataSource, private readonly usersService = new UsersService(ds)) {}

  public async create(req: Request) {
    const cuid = CreateUserInputDto.fromPlain(req.body);
    const user = await this.usersService.createUser(cuid);
    return asPlainUser(user);
  }
}
