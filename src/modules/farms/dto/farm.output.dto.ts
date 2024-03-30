import { Exclude, Expose, Transform } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { createAsPlain } from "../../../helpers/utils";

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
  @Exclude()
  @Exclude()
  public static asPlain = createAsPlain(FarmOutputDto);

  constructor({ user, ...data }: Farm) {
    this.owner = user.email;
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

  @Exclude()
  public lat: number;

  @Exclude()
  public lng: number;
}
