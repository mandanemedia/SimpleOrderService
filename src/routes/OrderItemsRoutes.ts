import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from 'joi';
import OrderItems from './../controllers/OrderItems';

class OrderItemsRoutes {
    public router;
    constructor(server: express.Express) {
        this.router = express.Router();

        const orderItems = new OrderItems();
        const idSchema = Joi.string().guid().required();
        const orderItemSchema = Joi.object().required().keys({
            orderId: Joi.string().guid().required(),
            inventoryId: Joi.string().guid().required(),
            quantity: Joi.number().positive().required()
        });

        //read all
        this.router.get('/', async (req, res, next) => {
            try{
                const { error } = Joi.string().guid().validate(req.query.orderId);
                if (error) {
                    throw error;
                }
                await orderItems.read(req, res);
            } catch (err){
                next(err);
            }
        });

        // read by id
        this.router.get('/:id', async (req, res, next) => {
            try{
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await orderItems.readById(req, res);
            } catch (err){
                next(err);
            }
        });

        //create
        this.router.post('/', async (req, res, next) => {
            try {
                const {error} = orderItemSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await orderItems.create(req, res);
            } catch (err){
                next(err);
            }
        });


        //update
        this.router.put('/:id', async (req, res, next) => {
            try {
                const updateSchema = Joi.object().required().keys({
                    quantity: Joi.number().positive().required()
                });
                const orderItemValidate = updateSchema.validate(req.body);
                if (orderItemValidate.error) {
                    throw orderItemValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await orderItems.update(req, res);
            } catch (err){
                next(err);
            }
        });

        //delete
        this.router.delete('/:id', async(req, res, next) => {
            try {
                const {error} = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await orderItems.delete(req, res);
            }  catch (err){
                next(err);
            }
        });
    };
};

export default OrderItemsRoutes;

