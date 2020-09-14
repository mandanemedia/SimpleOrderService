import { Request, Response } from 'express';
import { Inventory, HttpStatusCode } from './../models/types';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import InventoriesModel from './../models/InventoriesModel';

class Inventories {
    inventoriesModel: InventoriesModel;
    constructor() {
        this.inventoriesModel = new InventoriesModel();
    }
    
    async read (req: Request, res: Response) {
        try {
            const { productId } = req.query;
            return res.json(await this.inventoriesModel.read(productId));
        }
        catch (e) {
            throw e;
        }
    }

    async readById (req: Request, res: Response) {
        try{
            const id = req.params.id;
            const inventory = await this.inventoriesModel.readById(id);
            if (!!inventory) {
                return res.json(inventory);
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
            //TODO check that productId exist in DB first
            const { productId, color, size, quantity } = req.body;
            const inventoryId = uuid();
            const inventory = await this.inventoriesModel.create( inventoryId, productId, color, size, quantity);
            return res.json(inventory);
        }
        catch (e) {
            throw e;
        }
    }

    async update (req: Request, res: Response) {
        try{
            const { productId, color, size, quantity } = req.body;
            const inventoryId = req.params.id;
            const updatedCount = await this.inventoriesModel.update( inventoryId, productId, color, size, quantity);
            if (updatedCount[0] === 1) {
                return res.json({ inventoryId, productId, color, size, quantity });
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
        try{
            const id = req.params.id;
            const deletedCount = await this.inventoriesModel.delete(id);
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

export default Inventories;
