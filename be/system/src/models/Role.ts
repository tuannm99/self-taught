import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePerm } from './RolePerm';
import { User } from './User';

@Entity()
export class Role {
  @OneToMany(() => RolePerm, (rolePerm) => rolePerm.roleId)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  code: string;

  @Column({})
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: number;
}
