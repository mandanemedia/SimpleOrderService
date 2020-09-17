import BaseError from '../utils/BaseError';
import { HttpStatusCode } from './types';
import { order, orderItem, inventory } from './dbModels';
import { sequelize } from '../config/db';

class OrderItems {
    static convertToOrders(total, item) {
        const {
            quantity, inventoryId, orderId, orderItemId, order,
        } = item;
        const existingOrder = total.find((order) => order.orderId === orderId);
        if (existingOrder) {
            existingOrder.orderItems.push({
                quantity, inventoryId, orderId, orderItemId,
            });
        } else {
            total.push({
                orderId: order.orderId,
                date: order.date,
                customerId: order.customerId,
                status: order.status,
                orderItems: [{
                    quantity, inventoryId, orderId, orderItemId,
                }],
            });
        }
        return total;
    }

    static async verifyOrderId(orderId) {
        const orderRecord = await order.findOne({
            where: {
                orderId,
            },
        });
        if (!orderRecord) {
            throw new BaseError(HttpStatusCode.BAD_REQUEST, 'orderId is not valid');
        }
    }

    static async verifyOrderItemId(orderItemId) {
        const orderItemRecord = await orderItem.findOne({
            where: {
                orderItemId,
            },
        });
        if (!orderItemRecord) {
            throw new BaseError(HttpStatusCode.BAD_REQUEST, 'orderItemId is not valid');
        }
    }

    static async findAll(orderId) {
        if (orderId) {
            const orderItems = await orderItem.findAll({
                where: { orderId },
                include: [{
                    model: order, required: false,
                }],
            });
            return orderItems.reduce(OrderItems.convertToOrders, []);
        }
        const orderItems = await orderItem.findAll({
            include: [{
                model: order, required: false,
            }],
        });
        return orderItems.reduce(OrderItems.convertToOrders, []);
    }

    static findOneById(orderItemId:string) {
        return orderItem.findOne({
            where: {
                orderItemId,
            },
            include: [{
                model: order, required: false,
            }],
        });
    // return [orderItem].reduce(this.convertToOrders, [])[0];
    }

    static async create(orderItemId: string, orderId :string, inventoryId :string, quantity: number) {
        const transaction = await sequelize.transaction();
        try {
            await OrderItems.verifyOrderId(orderId);

            const inventoryRecord: any = await inventory.findOne({
                where: {
                    inventoryId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });
            if (!inventoryRecord) {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, 'inventoryId is not valid');
            }
            if ((inventoryRecord.quantity - quantity) < 0) {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, 'Inventory levels are insufficient');
            }
            inventoryRecord.quantity -= quantity;

            await inventoryRecord.save({ transaction });

            const orderRecod = await orderItem.create(
                {
                    orderItemId, orderId, inventoryId, quantity,
                },
                { transaction },
            );
            await transaction.commit();

            return orderRecod;
        } catch (e) {
            await transaction.rollback();
            if (e instanceof BaseError) {
                throw e;
            } else if (e.name === 'SequelizeUniqueConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT, 'combination of inventoryId, orderId should be unique!');
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async update(orderItemId: string, newQuantity: number) {
        const transaction = await sequelize.transaction();
        try {
            await OrderItems.verifyOrderItemId(orderItemId);

            const orderItemRecord = await orderItem.findOne({
                where: {
                    orderItemId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            const inventoryRecord : any = await inventory.findOne({
                where: {
                    inventoryId: orderItemRecord.inventoryId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            const delta = orderItemRecord.quantity - newQuantity;
            if (delta > inventoryRecord.quantity) {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, 'Inventory levels are insufficient');
            } else if (delta === 0) {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, 'Nothing to update');
            }
            inventoryRecord.quantity += delta;
            await inventoryRecord.save({ transaction });

            orderItemRecord.quantity = newQuantity;
            const orderItemUpdated = await orderItemRecord.save({ transaction });

            await transaction.commit();
            return orderItemUpdated;
        } catch (e) {
            await transaction.rollback();
            if (e instanceof BaseError) {
                throw e;
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async delete(orderItemId:string) {
        const transaction = await sequelize.transaction();
        try {
            await OrderItems.verifyOrderItemId(orderItemId);

            const orderItemRecord = await orderItem.findOne({
                where: {
                    orderItemId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            const inventoryRecord = await inventory.findOne({
                where: {
                    inventoryId: orderItemRecord.inventoryId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            inventoryRecord.quantity += orderItemRecord.quantity;

            await inventoryRecord.save({ transaction });

            const deletedId = await orderItem.destroy({
                where: {
                    orderItemId,
                },
                transaction,
            });

            await transaction.commit();
            return deletedId;
        } catch (e) {
            await transaction.rollback();
            if (e instanceof BaseError) {
                throw e;
            } else if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.CONFLICT);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }
}

export default OrderItems;
