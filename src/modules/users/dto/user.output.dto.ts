import { Exclude, Expose, Transform } from "class-transformer";
import { LocationDto, getLocationDtoByPoint } from "../../location/dto/location.dto";
import { User } from "../entities/user.entity";
import { createSanitizer } from "../../../helpers/createSanitizer";

/**
 * @openapi
 * components:
 *  schemas:
 *    UserOutputDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: 5f4b6f3b-3b7b-4b7b-8b3b-7b3b7b3b7b3b
 *        email:
 *          type: string
 *          example: no@no.no
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: 2021-08-31T12:00:00.000Z
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: 2021-08-31T12:00:00.000Z
 */
export class UserOutputDto {
  constructor({ address, coord, ...partial }: User) {
    this.location = getLocationDtoByPoint(coord, address);
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public email: string;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  @Exclude()
  public location: LocationDto;

  @Exclude()
  public farms: unknown[];
}

export const asPlainUser = createSanitizer(UserOutputDto);
