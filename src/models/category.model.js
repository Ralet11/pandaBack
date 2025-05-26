import { DataTypes } from "sequelize";
import sequelize from "../dbconfig.js";

const Category = sequelize.define(
  "category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(80), allowNull: false },
    emoji: { type: DataTypes.STRING(8), allowNull: true } // ej. "🍔"
  },
  { tableName: "category", timestamps: false }
);

export default Category;
