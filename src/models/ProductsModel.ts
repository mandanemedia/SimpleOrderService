import { sequelize } from './../config/db';
import { Sequelize, DataTypes } from 'sequelize';
import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './../models/types';

class ProductsModel {
    public product = sequelize.define('product', {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.FLOAT
        },
        productId: {
            type: DataTypes.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'product'
    });

    async read () {
        return await this.product.findAll();
    }
    
    async readById (productId:string) {
        return await this.product.findOne({
            where: {
                productId: productId
            }
        });
    }
    
    async create (productId :string, name: string, description: string, price: number ) {
        return await this.product.create({ productId, name, description, price});
    }

    async update (productId :string, name: string, description: string, price: number ) {
        try{
            return await this.product.update(
                { name, description, price }, 
                {
                    where: {
                        productId: productId
                    }
                }
            );
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

    async delete (productId:string) {
        try{
            return await this.product.destroy({
                where: {
                    productId: productId
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

export default ProductsModel;
