import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { HttpStatusCode } from '../models/types';
import BaseError from '../utils/BaseError';
import OrderItemsModel from '../models/OrderItemsModel';

class OrderItems {
    static async findAll(req: Request, res: Response) {
        try {
            const { orderId } = req.query;
            return res.json(await OrderItemsModel.findAll(orderId));
        } catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    static async findOneById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const orderItem = await OrderItemsModel.findOneById(id);
            if (orderItem) {
                return res.json(orderItem);
            }
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        } catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    static async create(req: Request, res: Response) {
        // TODO check that orderId exist in DB first
        const { orderId, inventoryId, quantity } = req.body;
        const orderItemId = uuid();
        const orderItem = await OrderItemsModel.create(orderItemId, orderId, inventoryId, quantity);
        return res.json(orderItem);
    }

    static async update(req: Request, res: Response) {
        const { quantity } = req.body;
        const orderItemId = req.params.id;
        const updatedCount = await OrderItemsModel.update(orderItemId, quantity);
        if (updatedCount) {
            return res.json({ orderItemId, quantity });
        }
        throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const deletedCount = await OrderItemsModel.delete(id);
        if (deletedCount === 1) {
            return res.json({ id });
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }
}

export default OrderItems;
