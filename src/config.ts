export const dbSettings = {
  database: process.env.DB || 'orderservice',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  server: process.env.DB_SERVER || 'localhost'
};