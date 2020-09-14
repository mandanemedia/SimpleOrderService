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

        const productsRoutes = new ProductsRoutes(server);
        server.use('/products', productsRoutes.router );
        const inventoriesRoutes = new InventoriesRoutes(server);
        server.use('/inventories', inventoriesRoutes.router );
        const customersRoutes = new CustomersRoutes(server);
        server.use('/customers', customersRoutes.router );
        const orderItemsRoutes = new OrderItemsRoutes(server);
        server.use('/orderitems', orderItemsRoutes.router );
        const ordersRoutes = new OrdersRoutes(server);
        server.use('/orders', ordersRoutes.router );

        //TODO make transaction query for order Items
        //TODO delete order even if orderitems is not empty using ts
        //TODO add basic Unit test using JEST

        server.use((err, req, res, next) => {
            handleError(err, res);
        });  
        server.use('/', router); 
    }
}

export default Router;