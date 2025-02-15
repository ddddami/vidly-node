const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
	const token = req.header("x-auth-token");
	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied, no token provided" });
	}
	

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch {
		res.status(403).json({ message: "Invalid token" });
	}
};
