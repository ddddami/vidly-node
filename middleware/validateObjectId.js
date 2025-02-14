const mongoose = require("mongoose");

const validateObjectId = (field) => {
	return (req, res, next) => {
		const id = field ? req.body[field] : req.params.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send(`Invalid ${field || "ObjectID"}`);
		}
		next();
	};
};

module.exports = validateObjectId;
