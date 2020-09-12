import express from 'express';
import bodyParser from 'body-parser';
import handleError from './utils/handleError';
import RoutesProducts from './routes/RoutesProducts';

class Router {

    constructor(server: express.Express) {
        const router = express.Router();
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        const routesProducts = new RoutesProducts(server);
        server.use('/products', routesProducts.router );

        server.use((err, req, res, next) => {
            handleError(err, res);
        });  
        server.use('/', router); 
    }
}

export default Router;