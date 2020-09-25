const express = require("express");
const { sequelize } = require("./models");
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/types');

const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: (ctx) => ctx,
	engine: {
		apiKey: "service:facebookchat:N4-AlzadKobzBM5YJbl77Q" // TODO: Refactor this to fetch from the env file
	},
	debug: process.env.PRODUCTION ? false : true
});

server.applyMiddleware({
	app
})

app.listen({ port: 4000 }, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

sequelize.authenticate()
	.then(() => console.log("Database connected"))
	.catch((e) => console.log(`Error connecting to database ${e.message}`))
