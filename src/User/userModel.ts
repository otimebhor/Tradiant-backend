import Sequelize, { Model } from "sequelize";
import { DB } from "../db/database";

export class UserModel extends Model {

}
UserModel.init(
  {
    username: {
      type: Sequelize.STRING(50),
      unique: {
        name: "username",
        msg: "An account already exists with this username",
      },
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
        },
      },
    },
    firstName: {
      type: Sequelize.STRING(30),
      validate: {
        min: 2,
      },
    },
    lastName: {
      type: Sequelize.STRING(50),
      validate: {
        min: 2,
      },
    },
    email: {
      type: Sequelize.STRING(50),
      unique: {
        name: "email",
        msg: "An account already exists with this email address.",
      },
      validate: {
        isEmail: { msg: "Please check this is a valid email" },
        notEmpty: { msg: "email can't be empty" },
      },
    },
    phoneNumber: {
      type: Sequelize.STRING(20),
      validate: {
        isNumeric: {
          msg: "Please confirm phonenumber contains valid characters",
        },
      },
    },
    password: {
      type: Sequelize.STRING(191),
      validate: {
        notEmpty: { msg: "password can't be empty" },
      },
    },
    gender: {
      type: Sequelize.STRING(20),
    },
  },
  {
    sequelize: DB,
    modelName: "users",
  }
);

UserModel.sync({ alter: true }).then(() => {
  console.log("User table migrated");
  // Table created
});
