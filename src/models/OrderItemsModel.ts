import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './/types';
import { order, orderItem, inventory } from './dbModels';
import { sequelize } from './../config/db';

class OrderItems {

    convertToOrders (total, item) {
        const { quantity, inventoryId, orderId, orderItemId, order } = item;
        const existingOrder = total.find( order => order.orderId == orderId);
        if(existingOrder){
            existingOrder.orderItems.push({ quantity, inventoryId, orderId, orderItemId });
        }
        else{
            total.push({ 
                orderId: order.orderId,
                date: order.date, 
                customerId: order.customerId, 
                status: order.status,
                orderItems: [{ quantity, inventoryId, orderId, orderItemId }] 
            });
        }
        return total;
    };
    
    async verifyOrderId ( orderId ) {
        const orderRecord = await order.findOne({
            where: {
                orderId: orderId
            },
        });
        if (! orderRecord) {
            throw new BaseError(HttpStatusCode.BAD_REQUEST, "orderId is not valid");
        }
    }

    async verifyOrderItemId ( orderItemId ) {
        const orderItemRecord = await orderItem.findOne({
            where: {
                orderItemId: orderItemId
            },
        });
        if (! orderItemRecord) {
            throw new BaseError(HttpStatusCode.BAD_REQUEST, "orderItemId is not valid");
        }
    }

    async read (orderId) {
        if(!!orderId){
            const orderItems = await orderItem.findAll({ 
                where: { orderId },
                include: [{ 
                    model: order, required: false
                }]
            });
            return orderItems.reduce(this.convertToOrders, []);
        }
        else
        {
            const orderItems =  await orderItem.findAll({
                include: [{ 
                    model: order, required: false
                }]
            });
            return orderItems.reduce(this.convertToOrders, []);
        }
    }
    
    async readById (orderItemId:string) {
        return await orderItem.findOne({
            where: {
                orderItemId: orderItemId
            },
            include: [{ 
                model: order, required: false
            }]
        });
        // return [orderItem].reduce(this.convertToOrders, [])[0];
    }
    
    async create (orderItemId: string, orderId :string, inventoryId :string, quantity: number ) {
        const transaction = await sequelize.transaction();
        try {
            await this.verifyOrderId( orderId );

            const inventoryRecord = await inventory.findOne({
                where: {
                    inventoryId: inventoryId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });
            if(!inventoryRecord)
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "inventoryId is not valid");
            }
            if( (inventoryRecord.quantity - quantity) < 0)
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "Inventory levels are insufficient");
            }
            inventoryRecord.quantity -= quantity;

            await inventoryRecord.save({transaction: transaction});

            const orderRecod =  await orderItem.create(
                { orderItemId, orderId, inventoryId, quantity },
                { transaction }
            );
            await transaction.commit();

            return orderRecod;
        }
        catch (e) {
            await transaction.rollback();
            if(e instanceof BaseError)
            {
                throw e;
            }
            else if ( e.name == "SequelizeUniqueConstraintError" ){
                throw new BaseError(HttpStatusCode.CONFLICT, "combination of inventoryId, orderId should be unique!");
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    async update (orderItemId: string, newQuantity: number ) {
        const transaction = await sequelize.transaction();
        try{
            await this.verifyOrderItemId( orderItemId );

            const orderItemRecord = await orderItem.findOne({
                where: {
                    orderItemId: orderItemId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });

            const inventoryRecord = await inventory.findOne({
                where: {
                    inventoryId: orderItemRecord.inventoryId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });

            const delta = orderItemRecord.quantity - newQuantity;
            if( delta > inventoryRecord.quantity )
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "Inventory levels are insufficient");
            }
            else if ( delta == 0){
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "Nothing to update");
            }
            const newInventoryQuantity = inventoryRecord.quantity + delta;
            
            inventoryRecord.quantity += delta;
            await inventoryRecord.save({transaction: transaction});

            orderItemRecord.quantity = newQuantity;
            const orderItemUpdated = await orderItemRecord.save({transaction: transaction});

            await transaction.commit();
            return orderItemUpdated;

        }
        catch(e){
            await transaction.rollback();
            if(e instanceof BaseError)
            {
                throw e;
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    async delete (orderItemId:string) {
        const transaction = await sequelize.transaction();
        try{
            await this.verifyOrderItemId( orderItemId );

            const orderItemRecord = await orderItem.findOne({
                where: {
                    orderItemId: orderItemId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });

            const inventoryRecord = await inventory.findOne({
                where: {
                    inventoryId: orderItemRecord.inventoryId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });

            inventoryRecord.quantity += orderItemRecord.quantity;

            await inventoryRecord.save({transaction: transaction});

            const deletedId = await orderItem.destroy({
                where: {
                    orderItemId: orderItemId
                },
                transaction: transaction
            });

            await transaction.commit();
            return deletedId;
        }
        catch(e){
            await transaction.rollback();
            if(e instanceof BaseError)
            {
                throw e;
            }
            else if( e.name == "SequelizeForeignKeyConstraintError")
            {
                throw new BaseError(HttpStatusCode.CONFLICT);
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }
};

export default OrderItems;
