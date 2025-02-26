const mongoose = require("mongoose");
const pino = require("pino")();

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/vidly")
    .then(() => pino.info("Connected to MongoDB"));
};
