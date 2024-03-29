import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { WithLocation } from "../../location/entities/with-location.entity";

@Unique(["name", "user"])
@Entity()
export class Farm extends WithLocation {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "float" })
  public yield: number;

  @Column({ type: "float" })
  public size: number;

  @ManyToOne(() => User, user => user.farms, {
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
