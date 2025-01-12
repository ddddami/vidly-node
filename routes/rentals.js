const express = require("express");
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

	res.send(rental);
});

module.exports = router;
