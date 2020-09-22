import { mockOrderItems } from './mocks';
import { orderItem } from './dbModels';
import OrderItemsModel from './OrderItemsModel';

jest.mock('./dbModels');
orderItem.findAll.mockReturnValue(Promise.resolve(mockOrderItems));

describe('OrderItemsModel', () => {
    test('Test OrderItemsModel.findAll()', async () => {
        const orderItemsModel = await OrderItemsModel.findAll();

        expect(orderItem.findAll).toHaveBeenCalledTimes(1);
        expect(orderItemsModel).toHaveLength(1);
        expect(orderItemsModel[0].orderItems).toHaveLength(2);
    });
});
