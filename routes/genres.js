const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const { Genre } = require("../models/genres");

const router = express.Router();

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	});
	return schema.validate(genre);
}

router.get("/", async (req, res) => {
	res.send(await Genre.find());
});

router.get("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid ID format");
	}

	const genre = await Genre.findById(req.params.id);
	if (!genre) return res.status(404).send("Genre not found");
	res.send(genre);
});

router.post("/", async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genre = await Genre.create({ name: req.body.name });
	res.send(genre);
});

router.put("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid ID format");
	}

	const { error } = validateGenre(req.body);

	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genre = await Genre.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
	});
	if (!genre) return res.status(404).send("Genre not found");

	genre.name = req.body.name;
	res.send(genre);
});

router.delete("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid ID format");
	}

	const genre = await Genre.findByIdAndDelete({ _id: req.params.id });
	if (!genre) return res.status(404).send("Genre not found!");
	res.send("Genre deleted");
});

module.exports = router;
