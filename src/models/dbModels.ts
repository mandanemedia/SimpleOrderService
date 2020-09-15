
import { sequelize } from './../config/db';
import { DataTypes } from 'sequelize';

// TODO How to generate model automatically 
// npm i sequelize-auto -g
// sequelize-auto -o "./src/main/models" -a .sequelize-auto.cfg.js -d somedbname -h <mydb.somehost.com> -u <myuser> -p 3306 -x <mypassword> -e mysql -t USER -C
// example https://medium.com/@kvr2277/sequelize-mocking-with-jest-and-node-933c1f439579

export const customer = sequelize.define('customer', {
    fullName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        }
    },
    customerId: {
        type: DataTypes.UUID,
        primaryKey: true,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'customer'
});

export const product = sequelize.define('product', {
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    productId: {
        type: DataTypes.UUID,
        primaryKey: true,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'product'
});

export const inventory = sequelize.define('inventory', {
    quantity: {
        type: DataTypes.INTEGER
    },
    color: {
        type: DataTypes.STRING
    },
    size: {
        type: DataTypes.STRING
    },
    productId: {
        type: DataTypes.UUID,
    },
    inventoryId: {
        type: DataTypes.UUID,
        primaryKey: true,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'inventory'
});

export const order = sequelize.define('order', {
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
    freezeTableName: true,
    timestamps: false,
    tableName: 'order'
});


export const  orderItem = sequelize.define('orderItem', {
    quantity: {
        type: DataTypes.INTEGER
    },
    inventoryId: {
        type: DataTypes.UUID
    },
    orderId : {
        type: DataTypes.UUID
    },
    orderItemId: {
        type: DataTypes.UUID,
        primaryKey: true,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'orderItem'
});

orderItem.belongsTo(order, {foreignKey: 'orderId'}); 
inventory.belongsTo(product, {foreignKey: 'productId'}); 
order.hasMany(orderItem, {foreignKey: 'orderId'})