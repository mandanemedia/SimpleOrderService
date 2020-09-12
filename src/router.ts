import express from 'express';
import bodyParser from 'body-parser';
import handleError from './utils/handleError';
import ProductsRoutes from './routes/ProductsRoutes';

class Router {

    constructor(server: express.Express) {
        const router = express.Router();
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        const productsRoutes = new ProductsRoutes(server);
        server.use('/products', productsRoutes.router );

        server.use((err, req, res, next) => {
            handleError(err, res);
        });  
        server.use('/', router); 
    }
}

export default Router;