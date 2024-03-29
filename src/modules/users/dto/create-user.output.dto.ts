import { LocationDto } from "../../location/dto/location.dto";
import { Expose, Transform } from "class-transformer";
import { User } from "../entities/user.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    UserDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        location:
 *          $ref: '#/components/schemas/CoordinateDto'
 */
export class CreateUserOutputDto {
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

  @Expose()
  public location: LocationDto;
}
