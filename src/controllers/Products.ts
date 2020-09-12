import { Request, Response } from 'express';
import Product from './../models/Product';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';
import ProductsDataModel from './../dataModels/ProductsDataModel';

class Products {
    productsDataModel: ProductsDataModel;
    constructor() {
        this.productsDataModel = new ProductsDataModel();
    }
    

    async read (req: Request, res: Response) {
        try {
            return res.json(await this.productsDataModel.read());
        }
        catch (e) {
            console.log(e);
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async readById (req: Request, res: Response) {
        const id = req.params.id;
        const product = await this.productsDataModel.readById(id);
        if (!!product) {
            return res.json(product);
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
    async create (req: Request, res: Response) {
        try {
            const { name, description, price } = req.body;
            const productId = uuid();
            const product: Product = await this.productsDataModel.create( productId, name, description, price);
            return res.json(product);
        }
        catch (e) {
            console.log(e);
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async update (req: Request, res: Response) {
        const { name, description, price } = req.body;
        const productId = req.params.id;
        const updatedCount = await this.productsDataModel.update(productId, name, description, price );
        if (updatedCount[0] === 1) {
            return res.json({ productId, name, description, price });
        }
        //TODO need to handle cannot update the record
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }

    async delete (req: Request, res: Response) {
        const id = req.params.id;
        const deletedCount = await this.productsDataModel.delete(id);
        if (deletedCount === 1) {
            return res.json({id});
        }
        //TODO need to handle cannot delete the record
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
};

export default Products;
