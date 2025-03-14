const mongoose = require("mongoose");
const Joi = require("joi");
const { objectId } = require("../utils/validateObjectId");

const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: { type: String, required: true, minlength: 5, maxLength: 50 },
			isGold: { type: Boolean, required: true, default: false },
			phone: { type: String, required: true, minLength: 5, maxLength: 50 },
		}),
	},
	movie: new mongoose.Schema({
		title: {
			type: String,
			required: true,
			trim: true,
			minLength: 5,
			maxLength: 255,
		},
		dailyRentalRate: {
			type: Number,
			required: true,
			min: 0,
			max: 255,
		},
		dateOut: { type: Date, required: true, default: Date.now },
		dateReturned: { type: Date },
		rentalFee: { type: Number, min: 0 },
	}),
});

function validateRental(rental) {
	const schema = Joi.object({
		customerId: Joi.custom(objectId, "ObjectID validation").required(),
		movieId: Joi.custom(objectId, "ObjectID validation").required(),
	});
	return schema.validate(rental);
}

const Rental = mongoose.model("Rental", rentalSchema);

module.exports.validateRental = validateRental;
module.exports.Rental = Rental;
