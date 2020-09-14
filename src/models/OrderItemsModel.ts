import { sequelize } from './../config/db';
import { DataTypes } from 'sequelize';
import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './../models/types';
import OrdersModel  from './OrdersModel';
import InventoriesModel  from './InventoriesModel';

class OrderItems {
    public orderItem = sequelize.define('orderItem', {
        quantity: {
            type: DataTypes.INTEGER
        },
        inventoryId: {
            type: DataTypes.UUID
        },
        orderId : {
            type: DataTypes.UUID
        },
        orderItemId: {
            type: DataTypes.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'orderItem'
    });

    ordersModel = new OrdersModel();
    inventoriesModel = new InventoriesModel();

    constructor() {
        this.orderItem.belongsTo(this.ordersModel.order, {foreignKey: 'orderId'}); 
        this.orderItem.belongsTo(this.inventoriesModel.inventory, {foreignKey: 'inventoryId'}); 
    }


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

    async read (orderId) {
        if(!!orderId){
            const orderItems = await this.orderItem.findAll({ 
                where: { orderId },
                include: [{ 
                    model: this.ordersModel.order, required: true
                }]
            });
            return orderItems.reduce(this.convertToOrders, []);
        }
        else
        {
            const orderItems =  await this.orderItem.findAll({
                include: [{ 
                    model: this.ordersModel.order, required: true
                }]
            });
            return orderItems.reduce(this.convertToOrders, []);
        }
    }
    
    async readById (orderItemId:string) {
        return await this.orderItem.findOne({
            where: {
                orderItemId: orderItemId
            },
            include: [{ 
                model: this.ordersModel.order, required: true
            }]
        });
        // return [orderItem].reduce(this.convertToOrders, [])[0];
    }
    
    //TODO convert it to transactional query to update the inventory and handel reject creating order 
    async create (orderItemId: string, orderId :string, inventoryId :string, quantity: number ) {
        try{
            return await this.orderItem.create({ orderItemId, orderId, inventoryId, quantity });
        }
        catch (e) {
            if( e.name == "SequelizeForeignKeyConstraintError" && e.parent.constraint == "order_product_inventoryId_fkey")
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "inventoryId is not valid");
            }
            else if ( e.name == "SequelizeForeignKeyConstraintError" && e.parent.constraint == "order_product_orderId_fkey")
            {
                throw new BaseError(HttpStatusCode.BAD_REQUEST, "orderId is not valid");
            }
            else{
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    //TODO convert it to transactional query to update the inventory and handel reject creating order 
    async update (orderItemId: string, orderId :string, inventoryId :string, quantity: number ) {
        try{
            return await this.orderItem.update(
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
            return await this.orderItem.destroy({
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
