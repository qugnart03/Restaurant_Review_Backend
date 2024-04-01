const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");
const cloudinary = require("../utils/cloudinary");

//MIDDLEWARE
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//REGISTER
const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //VALIDATION
    if (!username) {
      return res.status(400).send({
        success: false,
        message: "Name is invalid!!!",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is invalid!!!",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is invalid!!!",
      });
    }

    //EXISTING USER
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Register With This Email!!",
      });
    }

    //HASHED PASSWORD
    const hashedPassword = await hashPassword(password);

    //SAVE USER
    const user = await userModel({
      username,
      email,
      password: hashedPassword,
    }).create();

    return res.status(201).send({
      success: true,
      message: "Registration Successfully!!",
    });
  } catch (E) {
    console.log(E);
    return res.status(500).send({
      success: false,
      message: "Registration Failed!!",
      E,
    });
  }
};

//LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //VALIDATION
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please enter your full account and password!!",
      });
    }

    //FIND USER
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User invalid!!",
      });
    }

    //MATCH PASSWORD
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username and password!!",
      });
    }

    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    //UNDIFINED PASSWORD
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login Successfully!!",
      token,
      user,
    });
  } catch (E) {
    console.log(E);

    return res.status(500).send({
      success: false,
      message: "Login Failed!!",
      E,
    });
  }
};

//UPDATE
const updateUserController = async (req, res) => {
  try {
    const { fullname, password, email, phone, address, image } = req.body;

    //USER FIND
    const user = await userModel.findOne({ email });

    //VALIDATION
    if (password && password < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long!!",
      });
    }

    //LOAD IMAGE
    let updatedImage;

    if (image) {
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: "avatar",
      });
      updatedImage = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      };
    }

    //HASH PASSWORD
    const hashedPassword = password ? await hashPassword(password) : undefined;

    //UPDATE USER
    const updateUser = await userModel.findOneAndUpdate(
      { email },
      {
        fullname: fullname || user.fullname,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        image: updatedImage || user.image,
      },
      { new: true }
    );

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile updated!!",
      updateUser,
    });
  } catch (E) {
    console.log(E);

    return res.status(500).send({
      success: false,
      message: "Update Failed!!",
      E,
    });
  }
};

module.exports = {
  requireSignIn,
  registerController,
  loginController,
  updateUserController,
};
