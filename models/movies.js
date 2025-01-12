const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		maxlength: 255,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
});

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(5).max(255).required(),
		numberInStock: Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required(),
		genreId: Joi.string().required(),
	});

	return schema.validate(movie);
}

const Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
