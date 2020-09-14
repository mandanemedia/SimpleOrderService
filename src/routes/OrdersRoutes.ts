import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from 'joi';
import Orders from './../controllers/Orders';

class OrdersRoutes {
    public router;
    constructor(server: express.Express) {
        this.router = express.Router();

        const orders = new Orders();
        const idSchema = Joi.string().guid().required();
        const orderSchema = Joi.object().required().keys({
            customerId: Joi.string().guid().required(),
            date: Joi.date().required(),
            status: Joi.string().required(),
        });

        //read all orders
        this.router.get('/', async (req, res, next) => {
            try{
                await orders.read(req, res);
            } catch (err){
                next(err);
            }
        });

        // read order by id
        this.router.get('/:id', async (req, res, next) => {
            try{
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await orders.readById(req, res);
            } catch (err){
                next(err);
            }
        });

        //create new order
        this.router.post('/', async (req, res, next) => {
            try {
                const {error} = orderSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await orders.create(req, res);
            } catch (err){
                next(err);
            }
        });


        //update order
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
                await orders.update(req, res);
            } catch (err){
                next(err);
            }
        });

        //delete order
        this.router.delete('/:id', async(req, res, next) => {
            try {
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await orders.delete(req, res);
            }  catch (err){
                next(err);
            }
        });
    };
};

export default OrdersRoutes;

