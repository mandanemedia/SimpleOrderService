
import { mockOrderItems } from './mocks';
import { orderItem } from './dbModels';
import OrderItemsModel from './OrderItemsModel'

jest.mock('./dbModels');
orderItem.findAll.mockReturnValue(Promise.resolve(mockOrderItems));

describe("OrderItems", () => {  
    test("Test orderItemsModel.read()", async () => {
        const orderItemsModel = new OrderItemsModel();
        const orders = await orderItemsModel.read();

        expect(orderItem.findAll).toHaveBeenCalledTimes(1);
        expect(orders).toHaveLength(1);
        expect(orders[0].orderItems).toHaveLength(2);
    });
});