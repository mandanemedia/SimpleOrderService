import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { HttpStatusCode } from '../models/types';
import BaseError from '../utils/BaseError';
import ProductsModel from '../models/ProductsModel';

class Products {
    static async findAll(req: Request, res: Response) {
        return res.json(await ProductsModel.findAll());
    }

    static async findOneById(req: Request, res: Response) {
        const { id } = req.params;
        const product = await ProductsModel.findOneById(id);
        if (product) {
            return res.json(product);
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async create(req: Request, res: Response) {
        const { name, description, price } = req.body;
        const productId = uuid();
        const product = await ProductsModel.create(productId, name, description, price);
        return res.json(product);
    }

    static async update(req: Request, res: Response) {
        const { name, description, price } = req.body;
        const productId = req.params.id;
        const updatedCount = await ProductsModel.update(productId, name, description, price);
        if (updatedCount[0] === 1) {
            return res.json({
                productId, name, description, price,
            });
        }
        // TODO need to handle cannot update the record

        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const deletedCount = await ProductsModel.delete(id);
        if (deletedCount === 1) {
            return res.json({ id });
        }
        throw new BaseError(HttpStatusCode.NOT_FOUND);
    }
}

export default Products;
