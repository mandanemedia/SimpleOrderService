import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';

class ProductsDataModel {
    public product = sequelize.define('product', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        },
        productId: {
            type: Sequelize.UUID,
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

export default ProductsDataModel;
