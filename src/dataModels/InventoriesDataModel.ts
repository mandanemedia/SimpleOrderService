import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';

class InventoriesDataModel {
    public inventory = sequelize.define('inventory', {
        quantity: {
            type: Sequelize.INTEGER
        },
        productId: {
            type: Sequelize.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'inventory'
    });

    async read () {
        //TODO expand it to return the full product details
        return await this.inventory.findAll();
    }
    
    async readById (productId:string) {
        //TODO expand it to return the full product details
        return await this.inventory.findOne({
            where: {
                productId: productId
            }
        });
    }
    
    async create (productId :string, quantity: number ) {
        return await this.inventory.create({ productId, quantity});
    }

    async update (productId :string, quantity: number )  {
        return await this.inventory.update(
            { quantity }, 
            {
                where: {
                    productId: productId
                }
            }
        );
    }

    async delete (productId:string) {
        return await this.product.destroy({
            where: {
                productId: productId
            }
        });
    }
};

export default InventoriesDataModel;
