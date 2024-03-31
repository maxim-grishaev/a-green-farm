import { Expose } from "class-transformer";
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
  constructor({ token }: AccessToken) {
    this.token = token;
  }

  @Expose()
  public token: string;
}

export const asPlainToken = createAsPlain(TokenOutputDto);
