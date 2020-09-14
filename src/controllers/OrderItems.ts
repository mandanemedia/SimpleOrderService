import { Request, Response } from 'express';
import { HttpStatusCode } from './../models/types';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import OrderItemsModel from './../models/OrderItemsModel';

class OrderItems {
    orderItemsModel: OrderItemsModel;
    constructor() {
        this.orderItemsModel = new OrderItemsModel();
    }
    
    async read (req: Request, res: Response) {
        try {
            const { orderId } = req.query;
            return res.json(await this.orderItemsModel.read(orderId));
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async readById (req: Request, res: Response) {
        try {
            const id = req.params.id;
            const orderItem = await this.orderItemsModel.readById(id);
            if (!!orderItem) {
                return res.json(orderItem);
            }
            else {
                throw new BaseError(HttpStatusCode.NOT_FOUND);
            }
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async create (req: Request, res: Response) {
        try {
            //TODO check that orderId exist in DB first
            const { orderId, inventoryId, quantity } = req.body;
            const orderItemId = uuid();
            const orderItem = await this.orderItemsModel.create( orderItemId, orderId, inventoryId, quantity );
            return res.json(orderItem);
        }
        catch (e) {
            throw e;
        }
    }

    async update (req: Request, res: Response) {
        try {
            const { orderId, inventoryId, quantity } = req.body;
            const orderItemId = req.params.id;
            const updatedCount = await this.orderItemsModel.update( orderItemId, orderId, inventoryId, quantity );
            if (updatedCount[0] === 1) {
                return res.json({ orderItemId, orderId, inventoryId, quantity });
            }
            //TODO need to handle cannot update the record
            else {
                throw new BaseError(HttpStatusCode.NOT_FOUND);
            }
        }
        catch (e) {
            throw e;
        }
    }

    async delete (req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deletedCount = await this.orderItemsModel.delete(id);
            if (deletedCount === 1) {
                return res.json({id});
            }
            else {
                throw new BaseError(HttpStatusCode.NOT_FOUND);
            }
        }
        catch (e) {
            throw e;
        }
    }
};

export default OrderItems;
