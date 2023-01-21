import { DataSource } from 'typeorm';
import { User } from './User';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres_container',
  port: 5432,
  username: 'minhtuan',
  password: '12345678',
  database: 'ecm_system',
  entities: [User],
  synchronize: true,
  logging: true,
});
