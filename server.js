require("dotenv").config();

const express = require("express");
const movieRouter = require("./routers/movieRouter");
const userRouter = require("./routers/userRouter");
const seatRouter = require("./routers/seatRouter");

const bookingRouter = require("./routers/bookingRouter");
const cors = require("cors");
const { mongoose } = require("mongoose");

const app = express();
app.use(express.json({ limit: "5mb" }));

const corsOptions = {
  headers: "*",
};

app.use(cors(corsOptions));
app.use("/api/movies/", movieRouter);
app.use("/api/users/", userRouter);
app.use("/api/seats/", seatRouter);
app.use("/api/book/", bookingRouter);

const port = process.env.PORT;
console.log(port);

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
} catch (error) {
  console.log(error);
}
