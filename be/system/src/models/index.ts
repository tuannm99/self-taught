import { DataSource } from 'typeorm';
import { Perm } from './Perm';
import { Role } from './Role';
import { RolePerm } from './RolePerm';
import { Token } from './Token';
import { User } from './User';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres_container',
  port: 5432,
  username: 'minhtuan',
  password: '12345678',
  database: 'ecm_system',
  entities: [User, Token, Role, Perm, RolePerm],
  synchronize: true,
  logging: true,
});

export const userRepo = PostgresDataSource.getRepository(User);
export const tokenRepo = PostgresDataSource.getRepository(Token);
export const roleRepo = PostgresDataSource.getRepository(Role);
export const permRepo = PostgresDataSource.getRepository(Perm);
export const rolePermRepo = PostgresDataSource.getRepository(RolePerm);
