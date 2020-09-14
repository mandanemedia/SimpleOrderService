export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER = 500,
}

export type Product = {
    name: String,
    description: String,
    price: number
}

export type Customer = {
    customerId?: String,
    email: String,
    fullName: String
}

export type Inventory ={
    inventoryId?: String,
    productId: String,
    color: String,
    size: String,
    quantity: number
}

export type OrderItem = {
    orderId: String,
    inventoryId: String,
    quantity: Date
};

export enum OrderStatus {
    Shipped,
    Delivered
}

export type Order = {
    customerId: String,
    orderId: String,
    date: Date,
    status: OrderStatus
};

