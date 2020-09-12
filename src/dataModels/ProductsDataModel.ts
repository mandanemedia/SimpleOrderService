import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';

class ProductsDataModel {
    public product = sequelize.define('product', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
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
    
    async readById (productID:string) {
        return await this.product.findOne({
            where: {
                productId: productID
            }
        });
    }
    
    async create (productId :string, name: string, description: string, price: number ) {
        return await this.product.create({ productId, name, description, price});
    }

    async update (productId :string, name: string, description: string, price: number ) {
        return await this.product.update(
            { name, description, price }, 
            {
                where: {
                    productId: productId
                }
            }
        );
    }

    async delete (productID:string) {
        return await this.product.destroy({
            where: {
                productId: productID
            }
        });
    }
};

export default ProductsDataModel;
