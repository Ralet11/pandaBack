import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../dbconfig.js";

const Owner = sequelize.define(
  "owner",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(65), allowNull: false },
    lastName: { type: DataTypes.STRING(65), allowNull: false },
    email: {
      type: DataTypes.STRING(65),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    birthdate: { type: DataTypes.STRING(45), allowNull: true },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiration: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: "owner",
    timestamps: true,
    hooks: {
      beforeCreate: async (owner) => {
        owner.password = await bcrypt.hash(owner.password, 10);
      },
      beforeUpdate: async (owner) => {
        if (owner.changed("password"))
          owner.password = await bcrypt.hash(owner.password, 10);
      }
    }
  }
);

Owner.prototype.comparePassword = async function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

export default Owner;
