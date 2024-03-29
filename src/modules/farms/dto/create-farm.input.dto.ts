import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { User } from "../../users/entities/user.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateFarmInputDto:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 */
export class CreateFarmInputDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @Min(1)
  public size: number;

  @IsNumber()
  @Min(1)
  public yield: number;

  public user: Pick<User, "id">;
}
