import BaseError from '../utils/BaseError';
import { HttpStatusCode } from './types';
import { order, orderItem } from './dbModels';

class OrdersModel {
    static async findAll() {
        try {
            return await order.findAll({
                include: [{
                    model: orderItem, required: false,
                }],
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async findOneById(orderId:string) {
        try {
            return await order.findOne({
                where: { orderId },
                include: [{
                    model: orderItem, required: false,
                }],
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async create(orderId :string, customerId :string, date :Date, status:string) {
        try {
            return await order.create({
                orderId, customerId, date, status,
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async update(orderId :string, customerId :string, date :Date, status:string) {
        try {
            return await order.update(
                { customerId, date, status },
                {
                    where: {
                        orderId,
                    },
                },
            );
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async delete(orderId:string) {
        try {
            return await order.destroy({
                where: {
                    orderId,
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

export default OrdersModel;
