import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from 'joi';
import Products from './../controllers/Products';

class RoutesProducts {
    public router;
    constructor(server: express.Express) {
        this.router = express.Router();

        const products = new Products();

        const idSchema = Joi.string().guid().required();
        const productSchema = Joi.object().required().keys({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
        });

        //read all products
        this.router.get('/', async (req, res, next) => {
            try{
                await products.read(req, res);
            } catch (err){
                next(err);
            }
        });

        // read product by id
        this.router.get('/:id', async (req, res, next) => {
            try{
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await products.readById(req, res);
            } catch (err){
                next(err);
            }
        });

        //create new product
        this.router.post('/', async (req, res, next) => {
            try {
                const {error} = productSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await products.create(req, res);
            } catch (err){
                next(err);
            }
        });


        //update product
        this.router.put('/:id', async (req, res, next) => {
            try {
                const productValidate = productSchema.validate(req.body);
                if (productValidate.error) {
                    throw productValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await products.update(req, res);
            } catch (err){
                next(err);
            }
        });

        //delete product
        this.router.delete('/:id', async(req, res, next) => {
            try {
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await products.delete(req, res);
            }  catch (err){
                next(err);
            }
        });
    };
};

export default RoutesProducts;

