import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePerm } from './RolePerm';

@Entity()
export class Perm {
  @OneToMany(() => RolePerm, (rolePerm) => rolePerm.permId)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  code: string;

  @Column({})
  name: string;

}
