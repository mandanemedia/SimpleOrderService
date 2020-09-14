import { sequelize } from './../config/db';
import { DataTypes } from 'sequelize';
import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './../models/types';

class OrdersModel {
    public order = sequelize.define('order', {
        date: {
            type: DataTypes.DATE
        },
        customerId: {
            type: DataTypes.UUID,
        },
        status: {
            type: DataTypes.STRING
        },
        orderId: {
            type: DataTypes.UUID,
            primaryKey: true,
        }
    },{
        timestamps: false,
        tableName: 'order'
    });

    async read () {
        try{
            return await this.order.findAll({});
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
    
    async readById (orderId:string) {
        try{
            return await this.order.findOne({
                where: {  orderId: orderId }
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
    
    async create (orderId :string, customerId :string, date :Date, status:string ) {
        try{
            return await this.order.create({ orderId, customerId, date, status});
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

    async update (orderId :string, customerId :string, date :Date, status:string ) {
        try{
                return await this.order.update(
                { customerId, date, status }, 
                {
                    where: {
                        orderId: orderId
                    }
                }
            );
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

    async delete (orderId:string) {
        try{
            return await this.order.destroy({
                where: {
                    orderId: orderId
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

export default OrdersModel;
