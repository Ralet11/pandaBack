import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../dbconfig.js";

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(65), allowNull: false },
    lastName: { type: DataTypes.STRING(65), allowNull: true },
    email: {
      type: DataTypes.STRING(65),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    birthdate: { type: DataTypes.DATE, allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiration: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: "user",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password"))
          user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
);

User.prototype.comparePassword = async function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

export default User;
