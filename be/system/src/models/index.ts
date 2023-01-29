import { DataSource, Logger, QueryRunner } from 'typeorm';
import { dbLogger as logger } from '../libs/winston';
import { Perm } from './Perm';
import { Role } from './Role';
import { RolePerm } from './RolePerm';
import { Token } from './Token';
import { User } from './User';

class CustomTypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`${query} - ${JSON.stringify(parameters)}`);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`${query} - ${JSON.stringify(parameters)} - ${error}`);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.warn(`${query} - ${JSON.stringify(parameters)} - ${time}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.warn(`${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.warn(`${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    logger.info(`${message}`);
  }
}

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
  logger: new CustomTypeOrmLogger(),
});

export const userRepo = PostgresDataSource.getRepository(User);
export const tokenRepo = PostgresDataSource.getRepository(Token);
export const roleRepo = PostgresDataSource.getRepository(Role);
export const permRepo = PostgresDataSource.getRepository(Perm);
export const rolePermRepo = PostgresDataSource.getRepository(RolePerm);
