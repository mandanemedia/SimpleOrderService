import { Sequelize } from 'sequelize';

const dbSettings = {
  database: process.env.DB || 'orderservice',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  server: process.env.DB_SERVER || 'localhost'
};

const options = {
    host: dbSettings.server,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 1,
        idle: 10000,
        acquire: 30000,
    },
    freezeTableName: true,
    operatorsAliases: 0
}
export const sequelize = new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password, options);