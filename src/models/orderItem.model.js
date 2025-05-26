import { DataTypes } from "sequelize";
import sequelize from "../dbconfig.js";

const OrderItem = sequelize.define(
  "order_item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  },
  { tableName: "order_item", timestamps: false }
);

export default OrderItem;
