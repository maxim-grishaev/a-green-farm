import { plainToInstance } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserInputDto:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: example@app.com
 *        password:
 *          type: string
 *          default: password
 */
export class LoginUserInputDto {
  public static fromPlain = (data: unknown) => plainToInstance(LoginUserInputDto, data);

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
