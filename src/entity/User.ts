import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  @Length(4, 20)
  firstName: string;

  @Column({ length: 20 })
  @Length(4, 20)
  name: string;

  @Column({ length: 5 })
  @Length(2, 20)
  klasse: string;

  @Column({ length: 40 })
  @Length(4, 40)
  email: string;

  @Column({ length: 50 })
  @Length(4, 50)
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
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
