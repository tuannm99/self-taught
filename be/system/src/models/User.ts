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
import { ApiError, validateEntity } from '../libs/exception';

export enum LOGIN_METHOD {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  ACC = 'acc',
}

export enum METHOD_ACTION {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

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

  // @OneToMany(() => User, (user) => user.id)
  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedAt: Date;

  // @OneToMany(() => User, (user) => user.id)
  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedAt: Date;

  // @OneToMany(() => User, (user) => user.id)
  @Column({ nullable: true })
  deletedBy: string;

  @BeforeInsert()
  async validate() {
    const isUsernameExisted = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username: this.username })
      .getOne();
    if (isUsernameExisted) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `username ${this.username} existed!`
      );
    }

    const isEmailExisted = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email: this.email })
      .getOne();

    if (isEmailExisted) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `email ${this.email} existed!`
      );
    }
    await validateEntity(this);
  }
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  code: string;

  @Column({})
  name: string;

  @OneToMany(() => AccesList, (accessList) => accessList.id)
  @Column({})
  accessList: AccesList[];
}

@Entity()
export class AccesList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  functionCode: string;

  @Column()
  functionName: string;

  @Column({ type: 'enum', enum: METHOD_ACTION, default: METHOD_ACTION.READ })
  action: METHOD_ACTION;
}
