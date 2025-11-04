const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  url: String,
  cover: String,
});

const Song = mongoose.model("Song", SongSchema);