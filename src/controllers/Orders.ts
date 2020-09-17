import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { HttpStatusCode } from '../models/types';
import BaseError from '../utils/BaseError';
import OrdersModel from '../models/OrdersModel';

class Orders {
    static async read(req: Request, res: Response) {
        return res.json(await OrdersModel.read());
    }

    static async readById(req: Request, res: Response) {
        const { id } = req.params;
        const order = await OrdersModel.readById(id);
        if (order) {
            return res.json(order);
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async create(req: Request, res: Response) {
        const { customerId, date, status } = req.body;
        const orderId = uuid();
        const order = await OrdersModel.create(orderId, customerId, date, status);
        return res.json(order);
    }

    static async update(req: Request, res: Response) {
        const { customerId, date, status } = req.body;
        const orderId = req.params.id;
        const updatedCount = await OrdersModel.update(orderId, customerId, date, status);
        if (updatedCount[0] === 1) {
            return res.json({
                orderId, customerId, date, status,
            });
        }
        // TODO need to handle cannot update the record
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const deletedCount = await OrdersModel.delete(id);
        if (deletedCount === 1) {
            return res.json({ id });
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }
}

export default Orders;
