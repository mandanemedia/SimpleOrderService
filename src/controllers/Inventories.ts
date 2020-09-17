import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { HttpStatusCode } from '../models/types';
import BaseError from '../utils/BaseError';
import InventoriesModel from '../models/InventoriesModel';

class Inventories {
    static async read(req: Request, res: Response) {
        const { productId } = req.query;
        return res.json(await InventoriesModel.read(productId));
    }

    static async readById(req: Request, res: Response) {
        const { id } = req.params;
        const inventory = await InventoriesModel.readById(id);
        if (inventory) {
            return res.json(inventory);
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async create(req: Request, res: Response) {
        // TODO check that productId exist in DB first
        const {
            productId, color, size, quantity,
        } = req.body;
        const inventoryId = uuid();
        const inventory = await InventoriesModel.create(inventoryId, productId, color, size, quantity);
        return res.json(inventory);
    }

    static async update(req: Request, res: Response) {
        const {
            productId, color, size, quantity,
        } = req.body;
        const inventoryId = req.params.id;
        const updatedCount = await InventoriesModel.update(inventoryId, productId, color, size, quantity);
        if (updatedCount[0] === 1) {
            return res.json({
                inventoryId, productId, color, size, quantity,
            });
        }
        // TODO need to handle cannot update the record

        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const deletedCount = await InventoriesModel.delete(id);
        if (deletedCount === 1) {
            return res.json({ id });
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }
}

export default Inventories;
