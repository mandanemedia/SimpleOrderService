import { Request, Response } from 'express';
import { Product, HttpStatusCode } from './../models/types';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import ProductsModel from './../models/ProductsModel';

class Products {
    productsModel: ProductsModel;
    constructor() {
        this.productsModel = new ProductsModel();
    }
    
    async read (req: Request, res: Response) {
        try {
            return res.json(await this.productsModel.read());
        }
        catch (e) {
            throw e;
        }
    }

    async readById (req: Request, res: Response) {
        try{
            const id = req.params.id;
            const product = await this.productsModel.readById(id);
            if (!!product) {
                return res.json(product);
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
            const { name, description, price } = req.body;
            const productId = uuid();
            const product = await this.productsModel.create( productId, name, description, price);
            return res.json(product);
        }
        catch (e) {
            throw e;
        }
    }

    async update (req: Request, res: Response) {
        try{
            const { name, description, price } = req.body;
            const productId = req.params.id;
            const updatedCount = await this.productsModel.update(productId, name, description, price );
            if (updatedCount[0] === 1) {
                return res.json({ productId, name, description, price });
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
            const deletedCount = await this.productsModel.delete(id);
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

export default Products;
