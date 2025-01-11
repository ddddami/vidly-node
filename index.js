const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const genres = require("./routes/genres");

const app = express();

mongoose
	.connect("mongodb://localhost:27017/vidly")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
