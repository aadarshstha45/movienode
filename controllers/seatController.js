const Seats = require("../models/seatModel");

//adding a new seat
const addSeats = async (req, res) => {
  const { seatNumbers, bookings } = req.body;
  try {
    const addNew = await Seats.create({
      seatNumbers,
      bookings,
    });
    console.log(addNew);
    res.status(201).json({
      message: "Seats added successfully",
      seats: addNew,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//getting all the seats
const getSeats = async (req, res) => {
  try {
    const seats = await Seats.find();
    res.status(201).json({
      seats,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = { addSeats, getSeats };
