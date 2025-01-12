const mongoose = require("mongoose")


mongoose
  .connect("mongodb://localhost:27017/vidly")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const Author = mongoose.Model("Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    websiteL String,

  }))
