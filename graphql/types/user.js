const { gql } = require("apollo-server-express");

// The GraphQL schema
module.exports = gql`
	type User {
		email: String!,
		username: String!,
		token: String
		createdAt: String
	}
`
