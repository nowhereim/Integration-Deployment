import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const typeormConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  logging: 'all',
  timezone: 'Z',
};
console.log('DB DB_TYPE:', process.env.DB_TYPE);
console.log('DB Port:', process.env.DB_PORT);
export const dataSourceOptions: DataSourceOptions =
  typeormConfig as DataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
