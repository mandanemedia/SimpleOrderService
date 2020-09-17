import express from 'express';
import Joi from 'joi';
import Customers from '../controllers/Customers';

class CustomersRoutes {
    public router;

    constructor() {
        this.router = express.Router();

        const idSchema = Joi.string().guid().required();
        const customerSchema = Joi.object().required().keys({
            fullName: Joi.string().required(),
            email: Joi.string().email().required(),
        });

        // read all customers
        this.router.get('/', async (req, res, next) => {
            try {
                await Customers.read(req, res);
            } catch (err) {
                next(err);
            }
        });

        // read customer by id
        this.router.get('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Customers.readById(req, res);
            } catch (err) {
                next(err);
            }
        });

        // create new customer
        this.router.post('/', async (req, res, next) => {
            try {
                const { error } = customerSchema.validate(req.body);
                if (error) {
                    throw error;
                }
                await Customers.create(req, res);
            } catch (err) {
                next(err);
            }
        });

        // update a customer
        this.router.put('/:id', async (req, res, next) => {
            try {
                const customerValidate = customerSchema.validate(req.body);
                if (customerValidate.error) {
                    throw customerValidate.error;
                }
                const idValidate = idSchema.validate(req.params.id);
                if (idValidate.error) {
                    throw idValidate.error;
                }
                await Customers.update(req, res);
            } catch (err) {
                next(err);
            }
        });

        // delete customer
        this.router.delete('/:id', async (req, res, next) => {
            try {
                const { error } = idSchema.validate(req.params.id);
                if (error) {
                    throw error;
                }
                await Customers.delete(req, res);
            } catch (err) {
                next(err);
            }
        });
    }
}

export default CustomersRoutes;
