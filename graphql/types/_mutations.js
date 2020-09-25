const { gql } = require("apollo-server-express");

module.exports = gql `
	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
	}
`
