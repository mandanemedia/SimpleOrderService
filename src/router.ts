import express from 'express';
import Product from './models/Product';
import Products from './controller/Products';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser';
import handleError from './utils/handleError';
import Joi from 'joi';

class Router {

    constructor(server: express.Express) {
        const router = express.Router()
        const products = new Products();

        //read all products
        router.get('/products', (req, res, next) => {
            try{
                res.json(products.read());
            } catch (err){
                next(err);
            }
        });

        // read product by id
        router.get('/products/:id',  (req, res, next) => {
            try{
                res.json(products.readById(req.params.id));
            } catch (err){
                next(err);
            }
        });

        //create new product
        router.post('/products', (req, res, next) => {
            try {
                const productSchema = Joi.object().keys({
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    price: Joi.number().positive().required(),
                });
                const {error} = productSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                products.create(req, res);
            } catch (err){
                next(err);
            }
        });


        //update product
        router.put('/products/:id',  (req, res, next) => {
            try {
                res.json(products.update (req.params.id, req.body));
            } catch (err){
                next(err);
            }
        });

        //delete product
        router.delete('/products/:id',  (req, res, next) => {
            try {
                res.json({
                    id: products.delete(req.params.id)
                });
            }  catch (err){
                next(err);
            }
        });

        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());
        server.use('/', router);
        server.use((err, req, res, next) => {
            handleError(err, res);
        });
    }
}

export default Router;