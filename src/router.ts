import express from 'express';
import bodyParser from 'body-parser';
import handleError from './utils/handleError';
import ProductsRoutes from './routes/ProductsRoutes';
import InventoriesRoutes from './routes/InventoriesRoutes';
import CustomersRoutes from './routes/CustomersRoutes';
import OrderItemsRoutes from './routes/OrderItemsRoutes';
import OrdersRoutes from './routes/OrdersRoutes';

class Router {
    constructor(server: express.Express) {
        const router = express.Router();
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        const productsRoutes = new ProductsRoutes();
        server.use('/products', productsRoutes.router);
        const inventoriesRoutes = new InventoriesRoutes();
        server.use('/inventories', inventoriesRoutes.router);
        const customersRoutes = new CustomersRoutes();
        server.use('/customers', customersRoutes.router);
        const orderItemsRoutes = new OrderItemsRoutes();
        server.use('/orderitems', orderItemsRoutes.router);
        const ordersRoutes = new OrdersRoutes();
        server.use('/orders', ordersRoutes.router);

        server.use((err, req, res, next) => {
            handleError(err, req, res, next);
        });
        server.use('/', router);
    }
}

export default Router;
