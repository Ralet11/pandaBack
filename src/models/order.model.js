// src/models/order.model.js
import { DataTypes } from "sequelize";
import sequelize from "../dbconfig.js";

const Order = sequelize.define(
  "order",
  {
    id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    /* ───────────── datos de entrega ───────────── */
    deliveryAddress: { type: DataTypes.STRING(145) },
    pickupCode:      { type: DataTypes.STRING(10), allowNull: false },
    deliveryCode:    { type: DataTypes.STRING(10), allowNull: false },

    /* ───────────── relaciones ───────────── */
    shop_id:    { type: DataTypes.INTEGER },
    address_id: { type: DataTypes.INTEGER },
    user_id:    { type: DataTypes.INTEGER, allowNull: false },

    /* ───────────── montos ───────────── */
    finalPrice:  { type: DataTypes.DECIMAL(10, 2) },
    deliveryFee: { type: DataTypes.DECIMAL(10, 2) },
    price:       { type: DataTypes.DECIMAL(10, 2) },

    /* ───────────── tracking del repartidor ───────────── */
    deliveryLat:  { type: DataTypes.DECIMAL(10, 6), allowNull: true },
    deliveryLng:  { type: DataTypes.DECIMAL(10, 6), allowNull: true },
    deliveryName: { type: DataTypes.STRING(80),   allowNull: true },

    /* ───────────── payload para servicio externo ───────────── */
    deliveryPayload: {
      type:       DataTypes.JSON,
      allowNull:  true,
    },

    /* ───────────── estado ───────────── */
    status: {
      type:        DataTypes.ENUM(
        "pendiente",
        "aceptada",
        "envio",
        "finalizada",
        "rechazada",
        "cancelada",
      ),
      defaultValue: "pendiente",
      allowNull:    false,
    },
  },
  {
    tableName:  "order",
    timestamps: true,
  },
);

export default Order;
