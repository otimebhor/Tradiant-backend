import { UserModel } from "../User/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, JWT_EXPIRE } from "../config/index";
import { Op } from "sequelize";

//create jwt token
const getSignedJwtToken = function (user: any) {
  let body = { id: user.id, username: user.username };
  return jwt.sign({ user: body }, JWT_SECRET, {
    expiresIn: "180d",
  });
};

export const registerUser = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    gender,
  } = req.body;

  if (
    !username &&
    !firstName &&
    !lastName &&
    !email &&
    !phoneNumber &&
    !password &&
    !gender
  ) {
    return res.status(404).json({
      status: "fail",
      msg: "please enter the necessary fields",
    });
  }

  // check if user already exist
  const checkUser: any = await UserModel.findOne({
    where: {
      [Op.or]: [
        { username: username },
        { email: email },
        { phoneNumber: phoneNumber },
      ],
    },
    raw: true,
  });

  if (checkUser) {
    if (checkUser.email == email) {
      return res.status(404).json({
        status: "fail",
        data: "email already exist",
      });
    } else if (checkUser.username == username) {
      return res.status(404).json({
        status: "fail",
        data: "username already exist",
      });
    } else if (checkUser.phoneNumber == phoneNumber) {
      return res.status(404).json({
        status: "fail",
        data: "phoneNumber already exist",
      });
    }
  }

  //hashing password

  const hashedPassword = bcrypt.hashSync(password, 10);
  // create new user
  const newUser = await UserModel.create({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    gender,
  });

  //create token
  const token = getSignedJwtToken(newUser);

  res.status(201).json({
    data: newUser,
    token,
  });
};
