const express = require("express");
const { addSeats, getSeats } = require("../controllers/seatController");
const router = express.Router();

//add place
router.post("/addnew", addSeats);
router.get("/", getSeats);

module.exports = router;
