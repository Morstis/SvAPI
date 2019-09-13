import { Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
@Unique(["title"])
export class Articel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 10000 })
  text: string;

  @Column({ length: 20 })
  autor: string;

  @Column({ length: 200 })
  image: string;
}
