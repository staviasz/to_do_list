import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve('.env') });

export const ENV_DATABASE = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/postgres',
};

export const ENV_SERVER = {
  port: process.env.PORT || 3001,
  secretKeyJWT: process.env.SECRET_KEY_JWT || 'secret',
};
