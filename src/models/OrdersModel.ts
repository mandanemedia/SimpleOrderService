import BaseError from './../utils/BaseError';
import { HttpStatusCode } from './types';
import { order, orderItem } from './dbModels';

class OrdersModel {

    async read () {
        try{
            return await order.findAll({
                include: [{ 
                    model: orderItem, required: true
                }]
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
    
    async readById (orderId:string) {
        try{
            return await order.findOne({
                where: {  orderId: orderId },
                include: [{ 
                    model: orderItem, required: true
                }]
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
            return await order.create({ orderId, customerId, date, status});
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
                return await order.update(
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
            return await order.destroy({
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
