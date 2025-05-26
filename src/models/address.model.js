/*  models/address.model.js  */
import { DataTypes, Model } from "sequelize";
import sequelize from "../dbconfig.js";   // tu instancia Sequelize
import User      from "./user.model.js";  // modelo User ya existente

/**
 * Address
 *  - Cada usuario puede tener varias direcciones.
 *  - Al eliminar un usuario, sus direcciones se borran (ON DELETE CASCADE).
 */
class Address extends Model {
  /** Asociaciones (se invoca en models/index.js o donde agrupes modelos) */
  static associate() {
    User.hasMany(Address, {
      foreignKey: "user_id",
      as:         "addresses",
      onDelete:   "CASCADE",
      hooks:      true,            // necesario para CASCADE en Sequelize v6
    });

    Address.belongsTo(User, {
      foreignKey: "user_id",
      as:         "user",
    });
  }
}

Address.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },

    /* FK → user.id */
    user_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: User, key: "id" },
    },

    /* Datos de dirección */
    street:    { type: DataTypes.STRING(120), allowNull: false },
    city:      { type: DataTypes.STRING(80),  allowNull: false },
    state:     { type: DataTypes.STRING(80) },
    zipCode:   { type: DataTypes.STRING(20) },
    country:   { type: DataTypes.STRING(80),  allowNull: false },
    type:      { type: DataTypes.STRING(30),  defaultValue: "home" }, // home|work|other
    lat:       { type: DataTypes.DECIMAL(9, 6) },
    lng:       { type: DataTypes.DECIMAL(9, 6) },
    apartNumb: { type: DataTypes.STRING(20) },
    comments:  { type: DataTypes.TEXT },
    isDefault:  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /* timestamps automáticos (createdAt / updatedAt) */
  },
  {
    sequelize,
    modelName:  "Address",
    tableName:  "address",
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },                // Búsquedas rápidas por usuario
    ],
  }
);

export default Address;
