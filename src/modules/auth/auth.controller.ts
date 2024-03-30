import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginUserInputDto } from "./dto/login-user.input.dto";
import { TokenOutputDto } from "./dto/token.output.dto";
import { DataSource } from "typeorm";

export class AuthController {
  private readonly authService: AuthService;

  constructor(ds: DataSource) {
    this.authService = new AuthService(ds);
  }

  public async login(req: Request) {
    const luid = LoginUserInputDto.fromPlain(req.body);
    const accessToken = await this.authService.login(luid);
    return TokenOutputDto.asPlain(accessToken);
  }
}
