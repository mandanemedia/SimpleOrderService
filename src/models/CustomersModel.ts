import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './types';
import { customer } from './dbModels';

//TODO revise https://vivacitylabs.com/setup-typescript-sequelize/ or https://michalzalecki.com/using-sequelize-with-typescript/

class CustomersModel {

    async read () {
        return await customer.findAll();
    }
    
    async readById (customerId:string) {
        return await customer.findOne({
            where: {
                customerId: customerId
            }
        });
    }
    
    async create (customerId :string, fullName: string, email: string ) {
        try{
             return await customer.create({ customerId, fullName, email});
        }
        catch (e) {
            if( e.name == "SequelizeForeignKeyConstraintError" )
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    async update (customerId :string, fullName: string, email: string ) {
        try{
            return await customer.update(
                { fullName, email }, 
                {
                    where: {
                        customerId: customerId
                    }
                }
            );
        }
        catch (e) {
            if( e.name == "SequelizeForeignKeyConstraintError" )
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }

    }

    async delete (customerId:string) {
        try{
            return await customer.destroy({
                where: {
                    customerId: customerId
                }
            });
        }
        catch(e){
            if( e.name == "SequelizeForeignKeyConstraintError")
            {
                throw new BaseError(HttpStatusCode.CONFLICT);
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }
};

export default CustomersModel;
