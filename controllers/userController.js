const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (_id) => {
  return jwt.sign(
    {
      _id,
    },
    JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    return {
      expired: false,
      decode: decode,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        expired: true,
        message: "Token has expired",
      };
    } else {
      // Handle other verification errors here
      return {
        expired: true,
        message: "Token verification failed",
      };
    }
  }
};

const register = async (req, res) => {
  const { name, username, email, password, phone, image } = req.body;

  try {
    //for image, uploading it to the cloudinary and updating the link to the users collection
    let img;
    if (image)
      img = await cloudinary.uploader.upload(image, {
        folder: "images/users",
      });
    console.log(img.secure_url);
    const user = await Users.signup({
      name,
      username,
      email,
      password,
      phone,
      image: img?.secure_url ?? null,
    });

    const token = createToken(user._id);
    res.status(201).json({
      message: "User Registered Successfully",
      username,
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.login(username, password);
    // console.log(user);
    const id = user._id;

    //generating token
    user.password = undefined;
    const token = createToken(user._id);
    res.status(200).json({
      message: "Login Successful",
      // user: user,
      token: token,
      // username,
      // id,
      // token,
      // user_type,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
const accountStatus = async (req, res) => {
  const { token } = req.headers;

  try {
    if (!token) {
      res.status(401).json({
        message: "please, login, unauthorize",
      });
      return;
    }
    const tokenData = verifyToken(token);
    console.log(tokenData);
    if (tokenData?.expired) {
      res.status(401).json({
        message: tokenData?.message,
      });
      return;
    }

    const user = await Users.findOne({ _id: tokenData?.decode?._id }).exec();
    // // const id = user._id;

    // // //generating token
    // // user.password = undefined;
    // // const token = createToken(user._id);
    res.status(200).json({
      message: "fetch Successful",
      user: user,
      // username,
      // id,
      // token,
      // user_type,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = { register, login, accountStatus };
