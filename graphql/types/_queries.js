const { gql } = require("apollo-server-express");

module.exports = gql`
	type Query {
		users: [User]!
		user(username: String, email: String): User!
		login(username: String, password: String): User!
	}
`
