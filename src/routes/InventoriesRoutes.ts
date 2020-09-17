import express from 'express';
import Joi from 'joi';
import Inventories from '../controllers/Inventories';

class InventoriesRoutes {
    public router;

    constructor() {
        this.router = express.Router();

        const idSchema = Joi.string().guid().required();
        const inventorySchema = Joi.object().required().keys({
            productId: Joi.string().guid().required(),
            color: Joi.string().required(),
            size: Joi.string().required(),
            quantity: Joi.number().positive().required(),
        });

        // find all
        this.router.get('/', async (req, res, next) => {
            try {
                const { error } = Joi.string().guid().validate(req.query.productId);
                if (error) {
                    throw error;
                }
                await Inventories.findAll(req, res);
            } catch (err) {
                next(err);
            }
        });

        // findOne by id
        this.router.get('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Inventories.findOneById(req, res);
            } catch (err) {
                next(err);
            }
        });

        // create
        this.router.post('/', async (req, res, next) => {
            try {
                const { error } = inventorySchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await Inventories.create(req, res);
            } catch (err) {
                next(err);
            }
        });

        // update
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
                await Inventories.update(req, res);
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
                await Inventories.delete(req, res);
            } catch (err) {
                next(err);
            }
        });
    }
}

export default InventoriesRoutes;
