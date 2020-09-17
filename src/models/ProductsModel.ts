import BaseError from '../utils/BaseError';
import { HttpStatusCode } from './types';
import { product } from './dbModels';

class ProductsModel {
    static read() {
        return product.findAll();
    }

    static readById(productId:string) {
        return product.findOne({
            where: {
                productId,
            },
        });
    }

    static async create(productId :string, name: string, description: string, price: number) {
        try {
            return await product.create({
                productId, name, description, price,
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async update(productId :string, name: string, description: string, price: number) {
        try {
            return await product.update(
                { name, description, price },
                {
                    where: {
                        productId,
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

    static async delete(productId:string) {
        try {
            return await product.destroy({
                where: {
                    productId,
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

export default ProductsModel;
