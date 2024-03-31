import { Column, Index, Point } from "typeorm";

export abstract class WithLocation {
  @Column({ type: "varchar" })
  public address: string;

  @Column("geography", {
    spatialFeatureType: "Point",
    srid: 4326,
  })
  @Index({ spatial: true })
  public coord: Point;
}
