import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Point } from "typeorm";
import { getLatLngByPoint } from "../../../helpers/latLng";

// https://datatracker.ietf.org/doc/html/rfc7946#section-9
export const getPointByLatLng = (latLng: Omit<LocationDto, "address">): Point => {
  return {
    type: "Point",
    coordinates: [latLng.lng, latLng.lat],
  };
};

export const getLocationDtoByPoint = (point: Point, address = ""): LocationDto => {
  const coord = getLatLngByPoint(point);
  return new LocationDto({
    lat: coord.lat,
    lng: coord.lng,
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
