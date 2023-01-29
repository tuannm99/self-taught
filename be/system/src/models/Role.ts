import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  code: string;

  @Column({})
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: number;
}
