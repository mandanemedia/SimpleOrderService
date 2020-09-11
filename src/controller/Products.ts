import { Request, Response } from 'express';
import Product from './../models/Product';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';

class Products {
    products : Map<String, Product>;
    constructor() {
        this.products =  new Map<string, Product>();
        this.products[uuid()] = { name: "iPhone X", description: "128GB", price: 700};
        this.products[uuid()] = { name: "iPhone X", description: "256GB", price: 900};
        this.products[uuid()] = { name: "iPhone 12", description: "256GB", price: 1200};
    }

    read () : Array<Product> {
        try {
            return this.products;
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    readById (id : String): Product {
        if (!!this.products[id]) {
            return this.products[id];
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
    //create (body : Product) : String {
    create (req: Request, res: Response) {
        try {
            let body = req.body;
            let product: Product = {} as Product;
            Object.assign(product, body)
            const newUUID = uuid();
            this.products[newUUID] = product;
            res.json({
                id: newUUID
            });
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    update (id : String,  body : Product) : String {

        if (!!this.products[id]) {
            let product: Product = {} as Product;
            Object.assign(product, body)
            this.products[id] = product;
            return this.products[id];
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }


    delete (id : String) : String {
        console.log(id);
        if (!!this.products[id]) {
            delete this.products[id];
            return id;
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
};

export default Products;
