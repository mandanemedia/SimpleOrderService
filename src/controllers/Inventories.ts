import { Request, Response } from 'express';
import Inventory from './../models/Inventory';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';
import InventoriesDataModel from './../dataModels/InventoriesDataModel';

class Inventories {
    inventoriesDataModel: InventoriesDataModel;
    constructor() {
        this.inventoriesDataModel = new InventoriesDataModel();
    }
    

    async read (req: Request, res: Response) {
        try {
            return res.json(await this.inventoriesDataModel.read());
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async readById (req: Request, res: Response) {
        const id = req.params.id;
        const inventory = await this.inventoriesDataModel.readById(id);
        if (!!inventory) {
            return res.json(inventory);
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
    async create (req: Request, res: Response) {
        try {
            //TODO check that productId exist in DB first
            const { quantity } = req.body;
            const productId = req.params.id;
            const inventory: Inventory = await this.inventoriesDataModel.create( productId, quantity);
            return res.json(inventory);
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async update (req: Request, res: Response) {
        const { quantity } = req.body;
        const productId = req.params.id;
        const updatedCount = await this.inventoriesDataModel.update(productId, quantity );
        if (updatedCount[0] === 1) {
            return res.json({ productId, quantity });
        }
        //TODO need to handle cannot update the record
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }

    async delete (req: Request, res: Response) {
        const id = req.params.id;
        const deletedCount = await this.inventoriesDataModel.delete(id);
        if (deletedCount === 1) {
            return res.json({id});
        }
        //TODO need to handle cannot delete the record
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
};

export default Inventories;
