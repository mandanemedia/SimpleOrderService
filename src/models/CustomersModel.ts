import { sequelize } from './../config/db';
import { Sequelize, DataTypes } from 'sequelize';
import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './../models/types';

//TODO revise https://vivacitylabs.com/setup-typescript-sequelize/ or https://michalzalecki.com/using-sequelize-with-typescript/

class CustomersModel {
    public customer = sequelize.define('customer', {
        fullName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            }
        },
        customerId: {
            type: DataTypes.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'customer'
    });

    async read () {
        return await this.customer.findAll();
    }
    
    async readById (customerId:string) {
        return await this.customer.findOne({
            where: {
                customerId: customerId
            }
        });
    }
    
    async create (customerId :string, fullName: string, email: string ) {
        return await this.customer.create({ customerId, fullName, email});
    }

    async update (customerId :string, fullName: string, email: string ) {
        return await this.customer.update(
            { fullName, email }, 
            {
                where: {
                    customerId: customerId
                }
            }
        );
    }

    async delete (customerId:string) {
        try{
            return await this.customer.destroy({
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
