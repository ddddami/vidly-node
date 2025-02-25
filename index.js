require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const pino = require("pino")();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const error = require("./middleware/error");

require("dotenv").config();

const app = express();

process.on("uncaughtException", (ex) => {
	console.log(ex);
	pino.error(ex);
	process.exit(1);
});

process.on("unhandledRejection", (ex) => {
	// pino.error(ex.message, ex);
	// process.exit(1);
	throw ex; // passing it to uncaugthException handler
});

// const p = Promise.reject(new Error("something failed miserably"));
// p.then(() => console.log("done"));

mongoose
	.connect("mongodb://localhost:27017/vidly")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

app.get("/api/protected", authMiddleware, (req, res) => {
	res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
