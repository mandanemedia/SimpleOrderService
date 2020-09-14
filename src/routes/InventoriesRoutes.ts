import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from 'joi';
import Inventories from './../controllers/Inventories';

class InventoriesRoutes {
    public router;
    constructor(server: express.Express) {
        this.router = express.Router();

        const inventories = new Inventories();

        const idSchema = Joi.string().guid().required();
        const inventorySchema = Joi.object().required().keys({
            productId: Joi.string().guid().required(),
            color: Joi.string().required(),
            size: Joi.string().required(),
            quantity: Joi.number().positive().required()
        });

        //read all
        this.router.get('/', async (req, res, next) => {
            try{
                const { error } = Joi.string().guid().validate(req.query.productId);
                if (error) {
                    throw error;
                }
                await inventories.read(req, res);
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
                await inventories.readById(req, res);
            } catch (err){
                next(err);
            }
        });

        //create
        this.router.post('/', async (req, res, next) => {
            try {
                const {error} = inventorySchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await inventories.create(req, res);
            } catch (err){
                next(err);
            }
        });


        //update
        this.router.put('/:id', async (req, res, next) => {
            try {
                const inventoryValidate = inventorySchema.validate(req.body);
                if (inventoryValidate.error) {
                    throw inventoryValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await inventories.update(req, res);
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
                await inventories.delete(req, res);
            }  catch (err){
                next(err);
            }
        });
    };
};

export default InventoriesRoutes;

