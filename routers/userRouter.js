const express = require("express");
const router = express.Router();
const {
  register,
  login,
  accountStatus,
} = require("../controllers/userController");

//sign up users
router.post("/signup", register);

router.post("/login", login);

router.get("/user-details", accountStatus);

module.exports = router;
