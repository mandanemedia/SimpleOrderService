import { Request, Response } from 'express';
import { HttpStatusCode } from './../models/types';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import OrdersModel from './../models/OrdersModel';

class Orders {
    ordersModel: OrdersModel;
    constructor() {
        this.ordersModel = new OrdersModel();
    }
    
    async read (req: Request, res: Response) {
        try {
            return res.json(await this.ordersModel.read());
        }
        catch (e) {
            throw e;
        }
    }

    async readById (req: Request, res: Response) {
        try {
            const id = req.params.id;
            const order = await this.ordersModel.readById(id);
            if (!!order) {
                return res.json(order);
            }
            else {
                throw new BaseError(HttpStatusCode.NOT_FOUND);
            }
        }
        catch (e) {
            throw e;
        }
    }

    async create (req: Request, res: Response) {
        try {
            const { customerId, date, status } = req.body;
            const orderId = uuid();
            const order = await this.ordersModel.create( orderId, customerId, date, status);
            return res.json(order);
        }
        catch (e) {
            throw e;
        }
    }

    async update (req: Request, res: Response) {
        try {
            const { customerId, date, status } = req.body;
            const orderId = req.params.id;
            const updatedCount = await this.ordersModel.update( orderId, customerId, date, status);
            if (updatedCount[0] === 1) {
                return res.json({ orderId, customerId, date, status });
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
            const deletedCount = await this.ordersModel.delete(id);
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

export default Orders;
