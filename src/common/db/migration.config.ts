import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/types/env';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

const configService = new ConfigService<EnvironmentVariables, true>();

export const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  database: configService.get('POSTGRES_DB', { infer: true }),
  host: configService.get('POSTGRES_HOST', { infer: true }),
  username: configService.get('POSTGRES_USER', { infer: true }),
  password: configService.get('POSTGRES_PASSWORD', { infer: true }),
  port: configService.get('POSTGRES_PORT', { infer: true }),
  logging: configService.get('DB_LOGGING', { infer: true }),
  synchronize: false,
  parseInt8: true,
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export default new DataSource(typeormConfig);
