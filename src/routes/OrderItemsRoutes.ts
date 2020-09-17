import express from 'express';
import Joi from 'joi';
import OrderItems from '../controllers/OrderItems';

class OrderItemsRoutes {
    public router;

    constructor() {
        this.router = express.Router();

        const idSchema = Joi.string().guid().required();
        const orderItemSchema = Joi.object().required().keys({
            orderId: Joi.string().guid().required(),
            inventoryId: Joi.string().guid().required(),
            quantity: Joi.number().positive().required(),
        });

        // read all
        this.router.get('/', async (req, res, next) => {
            try {
                const { error } = Joi.string().guid().validate(req.query.orderId);
                if (error) {
                    throw error;
                }
                await OrderItems.read(req, res);
            } catch (err) {
                next(err);
            }
        });

        // read by id
        this.router.get('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await OrderItems.readById(req, res);
            } catch (err) {
                next(err);
            }
        });

        // create
        this.router.post('/', async (req, res, next) => {
            try {
                const { error } = orderItemSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await OrderItems.create(req, res);
            } catch (err) {
                next(err);
            }
        });

        // update
        this.router.put('/:id', async (req, res, next) => {
            try {
                const updateSchema = Joi.object().required().keys({
                    quantity: Joi.number().positive().required(),
                });
                const orderItemValidate = updateSchema.validate(req.body);
                if (orderItemValidate.error) {
                    throw orderItemValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await OrderItems.update(req, res);
            } catch (err) {
                next(err);
            }
        });

        // delete
        this.router.delete('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await OrderItems.delete(req, res);
            } catch (err) {
                next(err);
            }
        });
    }
}

export default OrderItemsRoutes;
