export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const databaseConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/aiqfome',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'aiqfome',
}; 