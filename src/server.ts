import app from './app';
import { sequelize } from './config/db';

const port: any = process.env.PORT || 3000

const server = new app().Start(port)
  .then(port => console.log(`Server running on port ${port}`))
  .catch(error => {
    console.log(error)
    process.exit(1);
  });

sequelize
  .authenticate()
      .then(() => {
          console.log('Connection has been established successfully to the database.');
      })
      .catch(err => {
          console.error('Unable to connect to the database.', err);
      });

export default server;