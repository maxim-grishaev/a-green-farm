import { Exclude, Expose, Transform } from "class-transformer";
import { LocationDto } from "../../location/dto/location.dto";
import { Farm } from "../entities/farm.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateFarmOutputDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        location:
 *          $ref: '#/components/schemas/CoordinateDto'
 */
export class CreateFarmOutputDto {
  constructor({ address, lat, lng, ...data }: Farm) {
    this.location = new LocationDto({ address, lat, lng });
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

  // Just to be safe
  @Exclude()
  public user: unknown;

  @Expose()
  public location: LocationDto;
}
