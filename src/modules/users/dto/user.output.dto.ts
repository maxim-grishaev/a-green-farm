import { LocationDto } from "../../location/dto/location.dto";
import { Exclude, Expose, Transform } from "class-transformer";
import { User } from "../entities/user.entity";
import { createAsPlain } from "../../../helpers/utils";

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
  @Exclude()
  @Exclude()
  public static asPlain = createAsPlain(UserOutputDto);

  constructor({ address, lat, lng, ...partial }: User) {
    this.location = new LocationDto({ address, lat, lng });
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
}
