import BaseError from '../utils/BaseError';
import { HttpStatusCode } from './types';
import { customer } from './dbModels';

// TODO revise https://vivacitylabs.com/setup-typescript-sequelize/
// or https://michalzalecki.com/using-sequelize-with-typescript/

class CustomersModel {
    // since return has to wait no need the keyword await here
    // and there is no other wat to return like create function which has thorws
    static findAll() {
        return customer.findAll();
    }

    static findOneById(customerId:string) {
        return customer.findOne({
            where: {
                customerId,
            },
        });
    }

    static async create(customerId :string, fullName: string, email: string) {
        try {
            return await customer.create({ customerId, fullName, email });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async update(customerId :string, fullName: string, email: string) {
        try {
            return await customer.update(
                { fullName, email },
                {
                    where: {
                        customerId,
                    },
                },
            );
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async delete(customerId:string) {
        try {
            return await customer.destroy({
                where: {
                    customerId,
                },
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }
}

export default CustomersModel;
