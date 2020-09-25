const bcrypt = require("bcryptjs");

module.exports.hashPassword = (password) => {
	return bcrypt.hash(password, 10);
}

module.exports.comparePassword = (password, hash) => {
	return bcrypt.compare(password, hash);
}
