import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { LocationDto } from "../../location/dto/location.dto";
import { Type, plainToInstance } from "class-transformer";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInputDto:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - location
 *      properties:
 *        email:
 *          type: string
 *          default: example@app.com
 *        password:
 *          type: string
 *          default: password
 *        location:
 *          $ref: '#/components/schemas/LocationDto'
 */
export class CreateUserInputDto {
  public static fromPlain = (data: unknown) => plainToInstance(CreateUserInputDto, data);

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  public location: LocationDto;
}
