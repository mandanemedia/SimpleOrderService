import express from 'express';
import bodyParser from 'body-parser';
import handleError from './utils/handleError';
import ProductsRoutes from './routes/ProductsRoutes';
import InventoriesRoutes from './routes/InventoriesRoutes';

class Router {

    constructor(server: express.Express) {
        const router = express.Router();
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        const productsRoutes = new ProductsRoutes(server);
        server.use('/products', productsRoutes.router );
        const inventoriesRoutes = new InventoriesRoutes(server);
        server.use('/inventories', inventoriesRoutes.router );

        server.use((err, req, res, next) => {
            handleError(err, res);
        });  
        server.use('/', router); 
    }
}

export default Router;