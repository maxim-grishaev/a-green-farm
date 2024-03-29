import { UnprocessableEntityError } from "errors/errors";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserInputDto } from "./dto/create-user.input.dto";
import { User } from "./entities/user.entity";
import { hashPassword } from "../../helpers/password";

export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(ds: DataSource) {
    this.usersRepository = ds.getRepository(User);
  }

  public async createUser(data: CreateUserInputDto): Promise<User> {
    const { email, password } = data;

    const existingUser = await this.findOneBy({ email: email });
    if (existingUser) throw new UnprocessableEntityError("A user for the email already exists");

    const hashedPassword = await hashPassword(password);
    const newUser = this.usersRepository.create({
      email,
      hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }
}
