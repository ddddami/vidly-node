const jwt = require("jsonwebtoken");

async function generateToken(user) {
	return jwt.sign(
		{ id: user.id, name: user.name, email: user.email },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		},
	);
}

module.exports.generateToken = generateToken;
