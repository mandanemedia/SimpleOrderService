import { Sequelize } from 'sequelize';

const dbSettings = {
  database: process.env.DB || 'orderservice',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  server: process.env.DB_SERVER || 'localhost'
};

export const sequelize = new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password, {
    host: dbSettings.server,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 1,
        idle: 10000,
        acquire: 30000,
    },
    underscored: false,
    freezeTableName: true,
});