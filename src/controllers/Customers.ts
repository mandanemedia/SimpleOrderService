import { Request, Response } from 'express';
import { Customer,  HttpStatusCode } from './../models/types';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import CustomersModel from './../models/CustomersModel';

class Customers {
    customersModel: CustomersModel;
    constructor() {
        this.customersModel = new CustomersModel();
    }
    
    async read (req: Request, res: Response) {
        try {
            return res.json(await this.customersModel.read());
        }
        catch (e) {
            throw e;
        }
    }

    async readById (req: Request, res: Response) {
        try{
            const id = req.params.id;
            const customer = await this.customersModel.readById(id);
            if (!!customer) {
                return res.json(customer);
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
            const { fullName, email } = req.body;
            const customerId = uuid();
            const customer = await this.customersModel.create( customerId, fullName, email );
            return res.json(customer);
        }
        catch (e) {
            throw e;
        }
    }

    async update (req: Request, res: Response) {
        try{
            const { fullName, email } = req.body;
            const customerId = req.params.id;
            const updatedCount = await this.customersModel.update( customerId, fullName, email );
            if (updatedCount[0] === 1) {
                return res.json({ customerId, fullName, email });
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
            const deletedCount = await this.customersModel.delete(id);
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

export default Customers;
