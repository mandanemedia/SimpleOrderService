import { Request, Response } from 'express';
import Customer from './../models/Customer';
import { v4 as uuid } from 'uuid';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';
import CustomersDataModel from './../dataModels/CustomersDataModel';

class Customers {
    customersDataModel: CustomersDataModel;
    constructor() {
        this.customersDataModel = new CustomersDataModel();
    }
    

    async read (req: Request, res: Response) {
        try {
            return res.json(await this.customersDataModel.read());
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async readById (req: Request, res: Response) {
        const id = req.params.id;
        const customer = await this.customersDataModel.readById(id);
        if (!!customer) {
            return res.json(customer);
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
    async create (req: Request, res: Response) {
        try {
            const { fullName, email } = req.body;
            const customerId = uuid();
            const customer: Customer = await this.customersDataModel.create( customerId, fullName, email );
            return res.json(customer);
        }
        catch (e) {
            throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async update (req: Request, res: Response) {
        const { fullName, email } = req.body;
        const customerId = req.params.id;
        const updatedCount = await this.customersDataModel.update( customerId, fullName, email );
        if (updatedCount[0] === 1) {
            return res.json({ customerId, fullName, email });
        }
        //TODO need to handle cannot update the record
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }

    async delete (req: Request, res: Response) {
        const id = req.params.id;
        const deletedCount = await this.customersDataModel.delete(id);
        if (deletedCount === 1) {
            return res.json({id});
        }
        else {
            throw new BaseError(HttpStatusCode.NOT_FOUND);
        }
    }
};

export default Customers;
