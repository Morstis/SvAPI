import { Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
@Unique(["id"])
export class Waypoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  place: number;

  @Column({ length: 50 })
  linkTo: string;

  @Column({ length: 20 })
  shownTitle: string;

  @Column({ length: 200 })
  image: string;

  @Column({ length: 10 })
  refereToURL: string;

  @Column()
  gruppe: number;
}
