import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  @Length(4, 20)
  vorname: string;

  @Column({ length: 20 })
  @Length(4, 20)
  nachname: string;

  @Column({ length: 5 })
  @Length(2, 20)
  klasse: string;

  @Column({ length: 45 })
  @Length(4, 45)
  email: string;

  @Column({ length: 50 })
  @Length(0, 50)
  uid: string;

  @Column({ length: 100 })
  @Length(4, 100)
  password: string;

  @Column({ length: 10 })
  @IsNotEmpty()
  role: string;

  @Column()
  verified: boolean;

  @Column()
  datenschutz: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  createUID() {
    let dt = new Date().getTime();
    const uid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      c => {
        // tslint:disable-next-line: no-bitwise
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);

        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    this.uid = uid;
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
