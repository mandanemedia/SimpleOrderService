import express from 'express';
import Joi from 'joi';
import Products from '../controllers/Products';

class ProductsRoutes {
    public router;

    constructor() {
        this.router = express.Router();

        const idSchema = Joi.string().guid().required();
        const productSchema = Joi.object().required().keys({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
        });

        // read all products
        this.router.get('/', async (req, res, next) => {
            try {
                await Products.read(req, res);
            } catch (err) {
                next(err);
            }
        });

        // read product by id
        this.router.get('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Products.readById(req, res);
            } catch (err) {
                next(err);
            }
        });

        // create new product
        this.router.post('/', async (req, res, next) => {
            try {
                const { error } = productSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await Products.create(req, res);
            } catch (err) {
                next(err);
            }
        });

        // update product
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
                await Products.update(req, res);
            } catch (err) {
                next(err);
            }
        });

        // delete product
        this.router.delete('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Products.delete(req, res);
            } catch (err) {
                next(err);
            }
        });
    }
}

export default ProductsRoutes;
