import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  refreshToken: string;

  @Column({ type: 'bigint' })
  iat: number;

  @ManyToOne(() => User, (user) => user.id)
  @Column({ nullable: true })
  userId: number;
}
