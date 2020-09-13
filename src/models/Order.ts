import Status from './Status'

type Order = {
    customerId: String,
    orderId: String,
    date: Date,
    status: Status
};
export default Order;