const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

require("dotenv").config();

const app = express();

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

app.get("/api/protected", authMiddleware, (req, res) => {
	res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
