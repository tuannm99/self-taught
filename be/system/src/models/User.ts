import { IsEmail, Length } from 'class-validator';
import httpStatus from 'http-status';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostgresDataSource } from '.';
import { LOGIN_METHOD } from '../constants';
import { ApiError, validateEntity } from '../libs/exception';
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  @Length(4, 20)
  username: string;

  @Column({})
  @Length(5, 100)
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  getFullName(): string {
    return `${this.lastName} ${this.middleName} + ${this.firstName}`;
  }

  @Column({ nullable: true })
  @Length(8, 11)
  phone: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isCustomer: boolean;

  @Column({ type: 'enum', enum: LOGIN_METHOD, default: LOGIN_METHOD.ACC })
  loginMethod: LOGIN_METHOD;

  @Column({ nullable: false, default: new Date() })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ nullable: true })
  isDeleted: boolean;

  @OneToMany(() => Role, (role) => role.userId)
  role: Role[];

  @BeforeInsert()
  async validate() {
    await validateEntity(this);
  }

  async checkUnameMail(id?: number) {
    let userQuery = PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username: this.username });

    let mailQuery = PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email: this.email });

    if (id) {
      mailQuery.andWhere('user.id != :id', { id: id });
      userQuery.andWhere('user.id != :id', { id: id });
    }

    const isUsernameExisted = await userQuery.getOne();
    if (isUsernameExisted) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `username ${this.username} existed!`
      );
    }

    const isEmailExisted = await mailQuery.getOne();
    if (isEmailExisted) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `email ${this.email} existed!`
      );
    }
  }
}
