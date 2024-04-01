import { Point } from "typeorm";

export type LatLng = {
  lat: number;
  lng: number;
};

export const getLatLng = (lat: number, lng: number): LatLng => ({ lat, lng });
export const getLatLngByPoint = (point: Point): LatLng => getLatLng(point.coordinates[1], point.coordinates[0]);
