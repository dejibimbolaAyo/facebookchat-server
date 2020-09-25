const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || "some not so random string";

module.exports.sign = (data) => {
	return jwt.sign({
		data
	}, JWT_SECRET, { expiresIn: 60 * 60 });
}

module.exports.verify = (authorization) => {
	const token = authorization.split("Bearer ")[1];
	return jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
		if(err) {
			throw new Error("Unauthenticated")
		}
		// TODO: check expiration
		return decodedToken.data;
	})
}
