import { Column } from "typeorm";

export class WithLocation {
  @Column({ type: "float" })
  public lat: number;

  @Column({ type: "float" })
  public lng: number;

  @Column({ type: "varchar" })
  public address: string;
}
