import express from 'express';
import Joi from 'joi';
import Orders from '../controllers/Orders';

class OrdersRoutes {
    public router;

    constructor() {
        this.router = express.Router();

        const idSchema = Joi.string().guid().required();
        const orderSchema = Joi.object().required().keys({
            customerId: Joi.string().guid().required(),
            date: Joi.date().required(),
            status: Joi.string().required(),
        });

        // find all orders
        this.router.get('/', async (req, res, next) => {
            try {
                await Orders.findAll(req, res);
            } catch (err) {
                next(err);
            }
        });

        // findOne order by id
        this.router.get('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Orders.findOneById(req, res);
            } catch (err) {
                next(err);
            }
        });

        // create new order
        this.router.post('/', async (req, res, next) => {
            try {
                const { error } = orderSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await Orders.create(req, res);
            } catch (err) {
                next(err);
            }
        });

        // update order
        this.router.put('/:id', async (req, res, next) => {
            try {
                const orderValidate = orderSchema.validate(req.body);
                if (orderValidate.error) {
                    throw orderValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await Orders.update(req, res);
            } catch (err) {
                next(err);
            }
        });

        // delete order
        this.router.delete('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Orders.delete(req, res);
            } catch (err) {
                next(err);
            }
        });
    }
}

export default OrdersRoutes;
