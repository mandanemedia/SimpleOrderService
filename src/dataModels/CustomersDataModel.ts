import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';

class CustomersDataModel {
    public customer = sequelize.define('customer', {
        fullName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
            }
        },
        customerId: {
            type: Sequelize.UUID,
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
        return await this.customer.destroy({
            where: {
                customerId: customerId
            }
        });
    }
};

export default CustomersDataModel;
