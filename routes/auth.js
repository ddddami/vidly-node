const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");

const router = express.Router();

router.post("/login", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return res.status(400).send("Invalid email or password.");
	}
	const validPassword = await bcrypt.compare(req.body.password, user.password);

	if (!validPassword) {
		return res.status(400).send("Invalid email or password.");
	}

	const token = await user.generateAuthToken();
	res.json({ token });
});

const validate = (user) => {
	const schema = Joi.object({
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().required().min(6).max(255),
	});

	return schema.validate(user);
};
module.exports = router;
