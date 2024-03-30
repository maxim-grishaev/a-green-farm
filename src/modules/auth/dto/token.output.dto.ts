import { Exclude, Expose } from "class-transformer";
import { AccessToken } from "../entities/access-token.entity";
import { createAsPlain } from "../../../helpers/utils";

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserOutputDto:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 */
export class TokenOutputDto {
  @Exclude()
  public static asPlain = createAsPlain(TokenOutputDto);

  constructor({ token }: AccessToken) {
    this.token = token;
  }

  @Expose()
  public token: string;
}
