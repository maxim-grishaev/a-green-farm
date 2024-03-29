import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Farm } from "../../farms/entities/farm.entity";
import { WithLocation } from "../../location/entities/with-location.entity";

@Entity()
export class User extends WithLocation {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Farm, farm => farm.user, {
    cascade: true,
  })
  public farms: Farm[];
}
