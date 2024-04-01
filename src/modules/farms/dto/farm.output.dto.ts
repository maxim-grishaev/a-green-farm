import { Exclude, Expose, Transform } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { createSanitizer } from "../../../helpers/createSanitizer";
import { getLocationDtoByPoint } from "../../location/dto/location.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    FarmOutputDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: 5f4b6f3b-3b7b-4b7b-8b3b-7b3b7b3b7b3b
 *        name:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: 2021-08-31T12:00:00.000Z
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: 2021-08-31T12:00:00.000Z
 *        owner:
 *          type: string
 *          example: no@no.no
 *        address:
 *          type: string
 */
export class FarmOutputDto {
  constructor({ user, coord, address, ...data }: Farm) {
    if (!user) {
      throw new Error("[FarmOutputDto] User is required");
    }
    this.owner = user.email;
    const loc = getLocationDtoByPoint(coord, address);
    this.lat = loc.lat;
    this.lng = loc.lng;
    this.address = loc.address;
    Object.assign(this, data);
  }

  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public yield: number;

  @Expose()
  public size: number;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  @Expose()
  public owner: string;

  @Expose()
  public address: string;

  @Expose()
  @Transform(({ value }) => (value as number) ?? null)
  public drivingDistance: number | null;

  @Exclude()
  public lat: number;

  @Exclude()
  public lng: number;
}

export const asPlainFarm = createSanitizer(FarmOutputDto);
