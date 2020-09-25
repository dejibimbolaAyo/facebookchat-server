'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/crypt');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	};
	User.init({
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty(value) {
					if (value.trim() === "") throw new Error("Username is empty");
				},
			},
			unique: {
				args: true,
				msg: "Username is already taken"
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty(value) {
					if (value.trim() === "") throw new Error("Empty email is not valid")
				},
				isEmail: {
					args: true,
					msg: "Email is not valid"
				}
			},
			unique: {
				args: true,
				msg: "Email already exist in our database"
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty(value) {
					if (value.trim() === "") throw new Error("Password is empty")
				},
			}
		},
		imageUrl: {
			type: DataTypes.STRING
		}
	}, {
		sequelize,
		modelName: 'User',
		tableName: "users"
	});

	User.beforeCreate(async (user, options) => {
		const hashedPassword = await hashPassword(user.password);
		user.password = hashedPassword;
	});

	return User;
};
