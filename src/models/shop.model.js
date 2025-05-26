import { DataTypes } from "sequelize";
import sequelize from "../dbconfig.js";

const Shop = sequelize.define(
  "shop",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    placeImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deliveryImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // Nuevo atributo para dirección completa
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "shop",
    timestamps: true
  }
);

export default Shop;
