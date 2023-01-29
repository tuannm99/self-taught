import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Perm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  code: string;

  @Column({})
  name: string;

}
