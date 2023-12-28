const { mongoose, SchemaTypes } = require("mongoose");

const Schema = mongoose.Schema;

const movies = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  genre: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  Language: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    enum: ["old", "nowShowing", "nextChange"],
  },
  releaseDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("movies", movies);
