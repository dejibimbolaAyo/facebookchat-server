const { User } = require("../../models");
const { comparePassword } = require("../../utils/crypt");
const { error } = require("../../utils/errors");
const { sign, verify } = require("../../utils/jwt");
const { ApolloError, UserInputError, AuthenticationError } = require("apollo-server-express");
const { Op } = require('sequelize')
const errorCode = require('../constants/errorcodes');

// A map of functions which return data for the schema.
module.exports = {
	Query: {
		users: async (_, args, context) => {
			const { headers } = context.req;
			let user;
			if (headers.authorization) {
				try {
					user = verify(headers.authorization)
				} catch (err) {
					throw new AuthenticationError("Unauthenticated", error(err));
				}
			} else {
				throw new AuthenticationError("Unauthenticated");
			}

			try {
				const users = await User.findAll({
					where: {
						username: {
							[Op.ne]: user.username
						}
					}
				});
				return users
			} catch (err) {
				throw new ApolloError(`Error fetching users ${err}`, errorCode.FORBIDDEN, error(err))
			}
		},
		user: async (_, args, context, info) => {
			let errors = {}
			try {
				const { username, email } = args;
				const query = username ? { username } : { email };

				const user = await User.findOne({
					where: query
				})

				if (!user) {
					errors.user = "User not found"
					throw new UserInputError(`User not found`, error(errors))
				}
				return user;
			} catch (err) {
				throw new ApolloError("Error fetching user", errorCode.NOT_FOUND, error(err));
			}
		},
		login: async (_, args) => {
			let errors = {}
			const { username, password } = args
			try {
				let user = await User.findOne({
					where: {
						username
					}
				})

				if (user) {
					const comparedPassword = await comparePassword(password, user.password)
					if (comparedPassword) {
						// sign token
						const token = sign({ username });

						return {
							...user.toJSON(),
							token,
							createdAt: user.createdAt.toISOString()
						};
					} else {
						errors.password = "Username or password incorrect"
						throw new UserInputError("Invalid credentials", error(errors))
					}
				}
				errors.password = "Username or password incorrect"
				throw new UserInputError("Invalid credentials", error(errors))
			} catch (err) {
				throw new UserInputError("Invalid credentials", error(err))
			}
		}
	},
	Mutation: {
		register: async (_, args, context, info) => {
			const { username, email, password } = args;
			try {
				const user = await User.create({
					username,
					password,
					email
				})
				return user;
			} catch (err) {
				throw new UserInputError("Bad input", error(err));
			}
		}
	}
};
