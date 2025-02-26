const express = require("express");
const authMiddleware = require("./middleware/auth");

require("dotenv").config();

const app = express();

require("./startup/errorHandler")();
require("./startup/routes")(app);
require("./startup/db")();

app.get("/api/protected", authMiddleware, (req, res) => {
	res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
