import { Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
@Unique(["title"])
export class Articel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  title: string;

  @Column({ length: 200 })
  text: string;

  @Column({ length: 20 })
  autor: string;

  @Column({ length: 20 })
  image: string;
}
