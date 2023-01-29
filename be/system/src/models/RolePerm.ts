import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { METHOD_ACTION } from '../constants';
import { Perm } from './Perm';
import { Role } from './Role';

@Entity()
export class RolePerm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.id)
  roleId: number;

  @ManyToOne(() => Perm, (perm) => perm.id)
  permId: number;

  @Column()
  functionCode: string;

  @Column()
  functionName: string;

  @Column({ type: 'enum', enum: METHOD_ACTION, default: METHOD_ACTION.READ })
  action: METHOD_ACTION;
}
