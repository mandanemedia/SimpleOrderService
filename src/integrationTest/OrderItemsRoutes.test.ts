import { mockOrderItems } from './../models/mocks';
import { orderItem } from './../models/dbModels';
import OrderItemsModel from './../models/OrderItemsModel';
import App from './../app';
import supertest from 'supertest';

jest.mock('./../models/dbModels');
orderItem.findAll.mockReturnValue(Promise.resolve(mockOrderItems));

const app = new App();
const request = supertest(app.httpServer);

describe('Integration test on /orderitems/', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('GET /orderitems/', async () => {
        const response = await request.get("/orderitems/");

        expect(orderItem.findAll).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].orderItems).toHaveLength(2);
    });
    test('GET /orderitems/ with not valid guid for orderId', async () => {
        const response = await request.get("/orderitems/").query({ orderId: '21323' });

        expect(orderItem.findAll).toHaveBeenCalledTimes(0);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error.details[0].message).toMatch(/valid GUID/);
    });
    test('GET /orderitems/ with valid guid for orderId', async () => {
        const findAll = jest.spyOn(OrderItemsModel, "findAll");
        const response = await request.get("/orderitems/").query({ orderId: '1164ef5c-1657-46b2-bb36-c74080e02b11' });

        expect(orderItem.findAll).toHaveBeenCalledTimes(1);
        expect(findAll).toHaveBeenCalledTimes(1); // The middleware fucntion 
        expect(findAll).toHaveBeenCalledWith('1164ef5c-1657-46b2-bb36-c74080e02b11');
        expect(response.status).toBe(200);
    });
    
});
