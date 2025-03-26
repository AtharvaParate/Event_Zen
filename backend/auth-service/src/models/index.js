const { Sequelize } = require("sequelize");
const path = require("path");

// Initialize Sequelize with SQLite for easier testing
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../eventzen_auth.sqlite"),
  logging: false,
});

// Import models
const UserModel = require("./user.model");
const User = UserModel(sequelize);

// Define model associations
// (add associations here if needed)

module.exports = {
  sequelize,
  User,
};
