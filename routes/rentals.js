const express = require("express");
const mongoose = require("mongoose");
const { Rental, validateRental } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");

const router = express.Router();

router.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");
	res.send(rentals);
});

router.post("/", async (req, res) => {
	const { error } = validateRental(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send("Invalid customer.");

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send("Invalid movie.");

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		let rental = new Rental({
			customer: {
				_id: customer._id,
				name: customer.name,
				phone: customer.name,
			},
			movie: {
				_id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate,
			},
		});

		rental = await rental.save();
		movie.numberInStock--;
		movie.save();

		session.endSession();
		res.send(rental);
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		console.log(err.message);
		res.status(500).send("Uhh.. something went wrong.");
	}
});

module.exports = router;
