import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './/types';
import { order, orderItem, inventory } from './dbModels';
import { sequelize } from './../config/db';
import { Sequelize } from 'sequelize';

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
            if (transaction)  { 
                await transaction.rollback();
            }
            console.log("-----------");
            console.log(e.name);
            if(e instanceof BaseError)
            {
                throw e;
            }
            else if ( e.name == "SequelizeUniqueConstraintError" ){
                throw new BaseError(HttpStatusCode.CONFLICT, "combination of inventoryId, orderId should be unique!");
            }
            else{
                console.log(e);
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    //TODO convert it to transactional query to update the inventory and handel reject creating order 
    async update (orderItemId: string, orderId :string, inventoryId :string, quantity: number ) {
        try{
            return await orderItem.update(
                { orderId, inventoryId, quantity }, 
                {
                    where: {
                        orderItemId: orderItemId
                    }
                }
            );
        }
        catch(e){
            if( e.name == "SequelizeForeignKeyConstraintError" && e.parent.constraint == "order_product_inventoryId_fkey")
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "inventoryId is not valid");
            }
            else if ( e.name == "SequelizeForeignKeyConstraintError" && e.parent.constraint == "order_product_orderId_fkey")
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "orderId is not valid");
            }
            else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    //TODO convert it to transactional query to update the inventory 
    async delete (orderItemId:string) {
        try{
            return await orderItem.destroy({
                where: {
                    orderItemId: orderItemId
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

export default OrderItems;
