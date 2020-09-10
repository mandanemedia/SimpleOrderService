import Status from './Status'

type Order = {
    customerId: String,
    orderId: String,
    productId: String,
    date: Date,
    status: Status,
    quantity : Number,
};
export default Order;