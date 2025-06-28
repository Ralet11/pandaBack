import { DataTypes } from "sequelize"
import sequelize from "../dbconfig.js"

const Shop = sequelize.define(
  "shop",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    /* ─────────────  Basic info  ───────────── */
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },

    /* ─────────────  Images  ───────────── */
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    placeImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deliveryImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    /* ─────────────  Location  ───────────── */
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    /* ─────────────  Relations  ───────────── */
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /* ─────────────  Trial flag  ───────────── */
    trial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "shop",
    timestamps: true,
  },
)

export default Shop
