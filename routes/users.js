const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");

const router = express.Router();

router.get("/", async (req, res) => {
	const users = (await User.find().sort("name")).map((user) =>
		_.pick(user, ["_id", "name", "email"]),
	);
	res.send(users);
});

router.post("/", async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered.");

	user = new User(_.pick(req.body, ["name", "email"]));
	user.password = await bcrypt.hash(req.body.password, 10);

	const token = await user.generateAuthToken();

	res
		.header("x-auth-token", token)
		.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
