import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type, plainToInstance } from "class-transformer";
import { LocationDto } from "../../location/dto/location.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateFarmInputDto:
 *      type: object
 *      required:
 *       - name
 *       - size
 *       - yield
 *       - location
 *      properties:
 *        name:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 *        location:
 *          $ref: '#/components/schemas/LocationDto'
 */
export class CreateFarmInputDto {
  public static fromPlain = (data: unknown) => plainToInstance(CreateFarmInputDto, data);

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  public name: string;

  @IsNumber()
  @Min(1)
  public size: number;

  @IsNumber()
  @Min(1)
  public yield: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  public location: LocationDto;
}
