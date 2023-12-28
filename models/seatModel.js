const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seatsAvailable: {
    type: [Schema.Types.Mixed],
  },
  seatsBooked: {
    type: [Schema.Types.Mixed],
  },
  status: { type: Boolean, default: false },
  ticketPrice: { type: Number, required: true },
  movieId: { type: Schema.Types.ObjectId, required: true },
});

const seats = new Schema({
  seatNumbers: {
    type: [Schema.Types.Mixed],
  },
  bookings: [bookingSchema],
});
module.exports = mongoose.model("seats", seats);
