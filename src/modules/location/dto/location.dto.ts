import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * @openapi
 * components:
 *  schemas:
 *    CoordinateDto:
 *      type: object
 *      required:
 *        - lat
 *        - lng
 *      properties:
 *       lat:
 *         type: number
 *         example: 52.3676
 *       lng:
 *         type: number
 *         example: 4.9041
 *       address:
 *         type: string
 *         example: "Kleinestraat 1, 1111XX, Amsterdam, Netherlands"
 */
export class LocationDto {
  constructor(coord: { lat: number; lng: number; address: string }) {
    Object.assign(this, coord);
  }

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => value % 90)
  public lat: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => value % 180)
  public lng: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  public address: string;
}
