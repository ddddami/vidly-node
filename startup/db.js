const mongoose = require("mongoose");
const pino = require("pino")();

module.exports = function () {
  const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/vidly";

  if (mongoose.connection.readyState === 1) {
    pino.info("MongoDB connection already established");
    return Promise.resolve();
  }

  return mongoose
    .connect(dbUri)
    .then(() => pino.info(`Connected to MongoDB: ${dbUri}`));
};
