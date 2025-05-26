// src/models/index.js

import sequelize from "../dbconfig.js";
import User      from "./user.model.js";
import Owner     from "./owner.model.js";
import Shop      from "./shop.model.js";
import Category  from "./category.model.js";
import Product   from "./product.model.js";
import Order     from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Address   from "./address.model.js";

/* ───────────── Relaciones ───────────── */

// Owners ↔ Shops
Owner.hasMany(Shop,   { foreignKey: "owner_id" });
Shop.belongsTo(Owner, { foreignKey: "owner_id" });

// Shops ↔ Products
Shop.hasMany(Product,   { foreignKey: "shop_id" });
Product.belongsTo(Shop, { foreignKey: "shop_id" });

// Categories ↔ Products
Category.hasMany(Product,   { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

// Users ↔ Orders
User.hasMany(Order,   { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// Owners ↔ Orders
Owner.hasMany(Order,   { foreignKey: "owner_id" });
Order.belongsTo(Owner, { foreignKey: "owner_id" });

// Orders ↔ Shop
Order.belongsTo(Shop, { 
  foreignKey: "shop_id", 
  as:        "shop" 
});
Shop.hasMany(Order, { 
  foreignKey: "shop_id", 
  as:        "orders" 
});

// Orders ↔ OrderItems
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as:        "order_items",
});
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as:        "order",
});

// OrderItems ↔ Products
Product.hasMany(OrderItem, {
  foreignKey: "product_id",
  as:        "order_items",
});
OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  as:        "product",
});

// Orders ↔ Products (Many-to-Many through OrderItem)
Order.belongsToMany(Product, {
  through:    OrderItem,
  foreignKey: "order_id",
  otherKey:   "product_id",
});
Product.belongsToMany(Order, {
  through:    OrderItem,
  foreignKey: "product_id",
  otherKey:   "order_id",
});

// Orders ↔ Address
Order.belongsTo(Address, {
  foreignKey: "address_id",
  as:        "address",
});
Address.hasMany(Order, {
  foreignKey: "address_id",
  as:        "orders",
});

// Users ↔ Addresses
User.hasMany(Address,   { foreignKey: "user_id", as: "addresses" });
Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

export {
  sequelize,
  User,
  Owner,
  Shop,
  Category,
  Product,
  Order,
  OrderItem,
  Address,
};
