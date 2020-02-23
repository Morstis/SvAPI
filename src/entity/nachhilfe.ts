import { Entity, Unique, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
@Unique(['id'])
export class NachhilfeUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  @Length(4, 20)
  nachname: string;

  @Column({ length: 20 })
  @Length(4, 20)
  vorname: string;

  @Column({ length: 45 })
  @Length(14, 45)
  email: string;

  @Column({ length: 10 })
  @Length(0, 20)
  klasse: string;

  @Column({ type: 'json', nullable: true })
  faecher: {};

  @Column({ type: 'json', nullable: true })
  jahrgang: {
    min: string;
    max: string;
  };

  @Column({ length: 10000 })
  info: string;
}
