import { UserModel } from "../User/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/index";
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
  } : any = req.body;

  if (
    !username ||
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !password ||
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

export const userLogin = async(req, res) => {
  const { email, password } = req.body;

  if ( !email && !password ) {
    return res.status(404).json({
        status: "fail",
        msg: "please enter the necessary fields",
      });
    };

  //check for user in database
  const user: any = await UserModel.findOne({
    where : {
      email: email
    }
  })
  if (!user){
    return res.status(404).json({
      status: "fail",
      msg: "user does not exist"
    });
  }

  //check if user password is correct
  const userPassword = await bcrypt.compare(password, user.password );
  if (user && userPassword ) {
      //generate token
      const token = getSignedJwtToken(user);
  
      res.status(201).json({
        data: user,
        token,
      });
    };
  
// if user not found in database
  // if (!user){
  //   return res.status(404).json({
  //     status: "fail",
  //     msg: "user does not exist"
  //   });
  // }
  if (!userPassword) {
    return res.status(404).json({
      status: "fail",
      msg: "Incorrect Password"
    });
  }
  // if user is found in database
  // compare haspassword with the password in database

  

  }



