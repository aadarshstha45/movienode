const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const users = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    user_type: {
      type: String,
      default: "guest",
      enum: ["guest", "admin"],
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//creating a static function for signup
users.statics.signup = async function ({
  name,
  username,
  email,
  password,
  phone,
  image,
}) {
  //checking empty fields
  if (!name || !username || !email || !password || !phone) {
    throw Error("All required fields must be filled");
  }
  //validation email
  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }

  //validation username
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  //validation phone
  if (!validator.isMobilePhone(phone)) {
    throw Error("Invalid Phone");
  }
  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw Error("Username already registered");
  }
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("Email already registered");
  }
  const phoneExists = await this.findOne({ phone });
  if (phoneExists) {
    throw Error("Phone number  already registered");
  }

  //hashing the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    username,
    email,
    password: hash,
    phone,
    image,
  });

  return user;
};

//creating a static function for login
users.statics.login = async function (username, password) {
  //checking empty field
  if (!username || !password) {
    throw Error("All fields are required");
  }

  //checking username match for login
  const user = await this.findOne({ username });
  if (!user) {
    throw Error("Invalid Credentials");
  }
  console.log(username)
  console.log(password)

  //checking and comparing password for above provided username
  const pass = await bcrypt.compare(password, user.password);
  console.log(pass)
  if (!pass) {
    throw Error("Invalid Credentials");
  }
  return user;
};

module.exports = mongoose.model("User", users);
