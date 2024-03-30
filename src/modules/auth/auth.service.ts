import config from "config/config";
import { fromUnixTime } from "date-fns";
import { decode, sign } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { DataSource, Repository } from "typeorm";
import { LoginUserInputDto } from "./dto/login-user.input.dto";
import { AccessToken } from "./entities/access-token.entity";

export class AuthService {
  private readonly accessTokenRepository: Repository<AccessToken>;
  private readonly usersService: UsersService;

  constructor(ds: DataSource) {
    this.accessTokenRepository = ds.getRepository(AccessToken);
    this.usersService = new UsersService(ds);
  }

  public async login(data: LoginUserInputDto): Promise<AccessToken> {
    const user = await this.usersService.validatePassword(data.email, data.password);

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );
    const tokenExpireDate = this.getJwtTokenExpireDate(token);

    const newToken = this.accessTokenRepository.create({
      token,
      user: { id: user.id },
      expiresAt: fromUnixTime(tokenExpireDate),
    });

    return this.accessTokenRepository.save(newToken);
  }

  public async getAccessToken(token: string): Promise<AccessToken> {
    return this.accessTokenRepository.findOneOrFail({ where: { token }, relations: ["user"] });
  }

  private getJwtTokenExpireDate(token: string): number {
    const { exp } = decode(token) as { [exp: string]: number };
    return exp;
  }
}
