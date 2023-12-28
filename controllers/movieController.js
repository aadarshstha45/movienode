const cron = require("node-cron");

const Movies = require("../models/movieModel");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");

//adding a new movies
const addMovie = async (req, res) => {
  const { title, genre, duration, releaseDate, Language, image, tag } =
    req.body;
  try {
    let img;
    if (image) {
      img = await cloudinary.uploader.upload(image, {
        folder: "images/movies",
      });
    }
    console.log(img);
    const addNew = await Movies.create({
      title,
      genre,
      duration,
      releaseDate,
      tag,
      Language,
      image: img?.secure_url ?? null,
    });
    console.log(addNew);
    res.status(201).json({
      message: "Movie added successfully",
      movie: addNew,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//filtering movies with the tag nextChange
const nextChange = async (req, res) => {
  const movies = await Movies.find({ tag: "nextChange" });
  console.log(movies);
  res.status(201).json({
    movies,
  });
};

//filtering movies with the tag nowShowing
const nowShowing = async (req, res) => {
  const movies = await Movies.find({ tag: "nowShowing" });
  console.log(movies);
  res.status(201).json({
    movies,
  });
};

//get all the movies from Movies collection
const getMovies = async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(201).json({
      message: "All Movies",
      movies,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get specified movies with ID provided
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: "No such movies",
      });
    }
    const movie = await Movies.findById(id);
    if (!movie) {
      res.status(404).json({
        message: "No such movies",
      });
    }
    res.status(201).json({
      movie,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//updating the movies collection
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(201).json(movie);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

//deleting the movies collection
const deleteMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movies.findOneAndDelete(id);
    res.status(201).json({
      deleted: movie,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  addMovie,
  getMovies,
  getMovieById,
  deleteMovies,
  updateMovie,
  nextChange,
  nowShowing,
};
