import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { HttpStatusCode } from '../models/types';
import BaseError from '../utils/BaseError';
import CustomersModel from '../models/CustomersModel';

class Customers {
    static async read(req: Request, res: Response) {
        return res.json(await CustomersModel.read());
    }

    static async readById(req: Request, res: Response) {
        const { id } = req.params;
        const customer = await CustomersModel.readById(id);
        if (customer) {
            return res.json(customer);
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async create(req: Request, res: Response) {
        const { fullName, email } = req.body;
        const customerId = uuid();
        const customer = await CustomersModel.create(customerId, fullName, email);
        return res.json(customer);
    }

    static async update(req: Request, res: Response) {
        const { fullName, email } = req.body;
        const customerId = req.params.id;
        const updatedCount = await CustomersModel.update(customerId, fullName, email);
        if (updatedCount[0] === 1) {
            return res.json({ customerId, fullName, email });
        }
        // TODO need to handle cannot update the record
        throw new BaseError(HttpStatusCode.BAD_REQUEST);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const deletedCount = await CustomersModel.delete(id);
        if (deletedCount === 1) {
            return res.json({ id });
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }
}

export default Customers;
