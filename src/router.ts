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

        const idSchema = Joi.string().guid().required();
        const productSchema = Joi.object().keys({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
        });

        //read all products
        router.get('/products', (req, res, next) => {
            try{
                products.read(req, res);
            } catch (err){
                next(err);
            }
        });

        // read product by id
        router.get('/products/:id',  (req, res, next) => {
            try{
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                products.readById(req, res);
            } catch (err){
                next(err);
            }
        });

        //create new product
        router.post('/products', (req, res, next) => {
            try {
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
                const productValidate = productSchema.validate(req.body);
                if (productValidate.error) {
                    throw productValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                products.update(req, res);
            } catch (err){
                next(err);
            }
        });

        //delete product
        router.delete('/products/:id',  (req, res, next) => {
            try {
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                products.delete(req, res);
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