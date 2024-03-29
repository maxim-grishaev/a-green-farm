import { UnprocessableEntityError } from "errors/errors";
import { DataSource, FindOptionsWhere } from "typeorm";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { User } from "./entities/user.entity";
import { getUserByDTO } from "./entities/getUserByDTO";

export class UsersService {
  constructor(ds: DataSource, private readonly usersRepository = ds.getRepository(User)) {}

  public async createUser(data: CreateUserInputDto): Promise<User> {
    const existingUser = await this.findOneBy({ email: data.email });
    if (existingUser) {
      throw new UnprocessableEntityError("A user for the email already exists");
    }

    const newUser = this.usersRepository.create(await getUserByDTO(data));
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }
}
