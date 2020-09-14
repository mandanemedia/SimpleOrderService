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

    async read (orderId) {
        if(!!orderId){
            return await this.orderItem.findAll({ 
                where: { orderId },
                include: [{ 
                    model: this.ordersModel.order, required: true
                }]
            });
        }
        else
        {
            return await this.orderItem.findAll({
                include: [{ 
                    model: this.ordersModel.order, required: true
                }]
            });
        }
    }
    
    async readById (orderItemId:string) {
        return await this.orderItem.findOne({
            where: {
                orderItemId: orderItemId
            }
        });
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
