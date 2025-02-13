const express = require("express");
const mongoose = require("mongoose");
const { Genre } = require("../models/genres");
const { Movie, validateMovie } = require("../models/movies");

const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await Movie.find();
	res.send(movies);
});

router.post("/", async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genreId = req.body.genreId;
	if (!mongoose.Types.ObjectId.isValid(genreId)) {
		return res.status(400).send("Invalid movie");
	}

	const genre = await Genre.findById(genreId);
	if (!genre) return res.status(400).send("Invalid genre.");

	const movie = new Movie({
		title: req.body.title,
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
	});

	await movie.save();
	res.send(movie);
});

router.put("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid movie");
	}

	const { error } = validateMovie(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genreId = req.body.genreId;
	if (!mongoose.Types.ObjectId.isValid(genreId)) {
		return res.status(400).send("Invalid genre");
	}
	const genre = await Genre.findById(genreId);
	if (!genre) return res.status(400).send("Invalid genre.");

	const { name, numberInStock, dailyRentalRate } = req.body;

	const movie = await Movie.findByIdAndUpdate(req.params.id, {
		name,
		numberInStock,
		dailyRentalRate,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
	});
	if (!movie) return res.status(404).send("Movie not found");
	res.send(movie);
});

router.get("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid movie");
	}

	const movie = await Movie.findById(req.params.id);
	if (!movie) return res.status(404).send("Movie not found");
	res.send(movie);
});

router.delete("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send("Invalid movie");
	}

	const movie = await Movie.findByIdAndDelete();
	if (!movie) return res.status(404).send("Movie not found!");
});

module.exports = router;
