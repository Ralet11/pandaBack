// src/models/order.model.js
import { DataTypes } from "sequelize";
import sequelize from "../dbconfig.js";

const Order = sequelize.define(
  "order",
  {
    id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deliveryAddress:  { type: DataTypes.STRING(145) },
    /* NUEVOS ↑ */
    pickupCode:       { type: DataTypes.STRING(10), allowNull: false },
    deliveryCode:     { type: DataTypes.STRING(10), allowNull: false },
    /* EXISTENTES ↓ */
    shop_id:         { type: DataTypes.INTEGER },
       address_id:         { type: DataTypes.INTEGER },
    user_id:          { type: DataTypes.INTEGER, allowNull: false },
    finalPrice:       { type: DataTypes.DECIMAL(10, 2) },
    deliveryFee:      { type: DataTypes.DECIMAL(10, 2) },
    price:            { type: DataTypes.DECIMAL(10, 2) },
    status: {
      type: DataTypes.ENUM(
        "pendiente",
        "aceptada",
        "envio",
        "finalizada",
        "rechazada",
        "cancelada"
      ),
      defaultValue: "pendiente",
      allowNull: false,
    },
  },
  { tableName: "order", timestamps: true }
);

export default Order;
