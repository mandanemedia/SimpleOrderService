import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';
import BaseError from './../utils/BaseError';
import HttpStatusCode  from './../models/HttpStatusCode';

class InventoriesDataModel {
    public inventory = sequelize.define('inventory', {
        quantity: {
            type: Sequelize.INTEGER
        },
        color: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.STRING
        },
        productId: {
            type: Sequelize.UUID,
        },
        inventoryId: {
            type: Sequelize.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'inventory'
    });

    async read (productId) {
        if(!! productId){
            return await this.inventory.findAll({ where: {productId}});
        }
        else
        {
            return await this.inventory.findAll();
        }
    }
    
    async readById (inventoryId:string) {
        //TODO expand it to return the full product details
        return await this.inventory.findOne({
            where: {
                inventoryId: inventoryId
            }
        });
    }
    
    async create (inventoryId :string, productId :string, color :string, size:string, quantity: number ) {
        return await this.inventory.create({ inventoryId, productId, color, size, quantity});
    }

    async update (inventoryId :string, productId :string, color :string, size:string, quantity: number ) {
        try{
                return await this.inventory.update(
                { color, size, quantity}, 
                {
                    where: {
                        inventoryId: inventoryId,
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

    async delete (inventoryId:string) {
        try{
            return await this.inventory.destroy({
                where: {
                    inventoryId: inventoryId
                }
            });
        }
        catch(e){
            console.log(e);
            console.log('     ------------------------    e');
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

export default InventoriesDataModel;
