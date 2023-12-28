const express = require("express");
const {
  addMovie,
  getMovies,
  getMovieById,
  deleteMovies,
  updateMovie,
  nextChange,
  nowShowing,
} = require("../controllers/movieController");
const router = express.Router();

//add movies
router.post("/addnew", addMovie);

//get Movies By Tags
router.get("/nextChange", nextChange);
router.get("/nowShowing", nowShowing);

//get movie details
router.get("/:id", getMovieById);

//get all movies
router.get("/", getMovies);

//edit movies
router.patch("/:id", updateMovie);

//delete movies
router.delete("/:id", deleteMovies);

module.exports = router;
