import BaseError from '../utils/BaseError';
import { HttpStatusCode } from './types';
import { inventory, product } from './dbModels';

class InventoriesModel {
    static convertToProducts(total, item) {
        const {
            inventoryId, quantity, color, size, productId, product,
        } = item;
        const existingProduct = total.find((product) => product.productId === productId);
        if (existingProduct) {
            existingProduct.inventories.push({
                inventoryId, quantity, color, size,
            });
        } else {
            total.push({
                name: product.name,
                description: product.description,
                price: product.price,
                productId: product.productId,
                inventories: [{
                    inventoryId, quantity, color, size,
                }],
            });
        }
        return total;
    }

    static async read(productId) {
        if (productId) {
            const inventories = await inventory.findAll({
                where: { productId },
                include: [{
                    model: product, required: false,
                }],
            });
            return inventories.reduce(InventoriesModel.convertToProducts, []);
        }
        const inventories = await inventory.findAll({
            include: [{
                model: product, required: false,
            }],
        });
        return inventories.reduce(InventoriesModel.convertToProducts, []);
    }

    static readById(inventoryId:string) {
        return inventory.findOne({
            where: { inventoryId },
            include: [{
                model: product, required: false,
            }],
        });
    }

    static async create(inventoryId :string, productId :string, color :string, size:string, quantity: number) {
        try {
            return await inventory.create({
                inventoryId, productId, color, size, quantity,
            });
        } catch (e) {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new BaseError(HttpStatusCode.BAD_REQUEST);
            } else {
                throw new BaseError(HttpStatusCode.INTERNAL_SERVER);
            }
        }
    }

    static async update(inventoryId :string, productId :string, color :string, size:string, quantity: number) {
        try {
            return await inventory.update(
                { color, size, quantity },
                {
                    where: {
                        inventoryId,
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

    static async delete(inventoryId:string) {
        try {
            return await inventory.destroy({
                where: {
                    inventoryId,
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

export default InventoriesModel;
