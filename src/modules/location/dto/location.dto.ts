import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Point } from "typeorm";

// https://datatracker.ietf.org/doc/html/rfc7946#section-9
export const getPointByCoord = (location: Omit<LocationDto, "address">): Point => {
  return {
    type: "Point",
    coordinates: [location.lng, location.lat],
  };
};

export const getLocationDtoByPoint = (point: Point, address = ""): LocationDto => {
  return new LocationDto({
    lat: point.coordinates[1],
    lng: point.coordinates[0],
    address,
  });
};

/**
 * @openapi
 * components:
 *  schemas:
 *    LocationDto:
 *      type: object
 *      required:
 *        - lat
 *        - lng
 *        - address
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
