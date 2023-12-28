const Bookings = require("../models/bookingModel");
const Seats = require("../models/seatModel");
const mongoose = require("mongoose");
const check = require("../utils/seatscheck");
const Movies = require("../models/movieModel");

//validating seats for movies
const createBooking = async (req, res) => {
  try {
    const { date, time, selectedSeats, userId } = req.body;
    const { movieId } = req.params;

    //checking the validation of id of the movie
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(404).json({
        error: "No such movie",
      });
    }

    const inputDate = new Date(date);

    //finding the seats for the movie of provided date and time
    const seatData = await Seats.findOne({
      "bookings.movieId": movieId,
      "bookings.date": date,
    });
    if (!seatData) {
      return res.json("Invalid Selection");
    }

    //filtering the above data with the provided movieId and date
    const seats = seatData.bookings.filter(
      (booking) =>
        booking.movieId.equals(movieId) &&
        booking.date.getTime() === inputDate.getTime()
    );

    //checking if the provided movieId and date is valid or not
    if (seats.length === 0) {
      return res.json("Invalid Selection");
    }

    //getting the total price for the selected tickets
    const ticket = seats.map((booking) => booking.ticketPrice);
    //converting the above value in array to number
    const price = ticket * 1;
    //multiplying number of seats selected nad the price of the ticket
    const cost = selectedSeats.length * price;

    //finding the seats available and storing it in a variable
    const availableSeats = seats.find(
      (booking) =>
        booking.movieId.equals(movieId) &&
        booking.date.getTime() === inputDate.getTime()
    ).seatsAvailable;

    console.log("Available Seats: ", availableSeats);

    //checking if the seats provided are available in the database or not
    const areSeatsAvailable = await check(selectedSeats, availableSeats);
    console.log("Selected Seats: ", selectedSeats);

    //checking the above function
    if (areSeatsAvailable === true) {
      console.log("All selected seats are available. Proceed with booking.");
      //since all the selected seats are available and the date is validated the booking will created
      const newBooking = await Bookings.create({
        date,
        startAt: time,
        seatNumbers: selectedSeats,
        ticketPrice: price,
        total: cost,
        movieId,
        userId,
      });

      //after the booking is done. removing the selected seats from the seats available and pushing it to the seats booked
      if (seatData) {
        seatData.bookings.forEach((booking) => {
          if (
            booking.movieId.equals(movieId) &&
            booking.date.getTime() === inputDate.getTime()
          ) {
            // Modify the booking in memory
            booking.seatsBooked.push({ selectedSeats });
            booking.seatsAvailable = booking.seatsAvailable.filter(
              (seat) => !selectedSeats.includes(seat)
            );
          }
        });
      }
      const updatedSeatsData = await seatData.save();
      res.json({ updatedSeatsData });
    } else {
      const invalidSeats = selectedSeats.filter(
        (seat) => !availableSeats.includes(seat)
      );

      if (invalidSeats.length > 0) {
        return res
          .status(400)
          .json({ error: "Some or all selected seats are not available." });
      }
    }

    //validating seats so that already booked seats cannot be booked again
  } catch (error) {
    console.log(error);
  }
};

//getting all the bookings done
const getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find();
    const seats = await Bookings.find("seats").count();
    console.log(seats);
    res.status(201).json({
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = { createBooking, getBookings };
