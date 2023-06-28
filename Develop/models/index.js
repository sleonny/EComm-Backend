const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig.options
);

const models = {};

models.Category = sequelize.define('category', {
  // Define the category model attributes here
});

models.Product = sequelize.define('product', {
  // Define the product model attributes here
});

models.Tag = sequelize.define('tag', {
  // Define the tag model attributes here
});

// Define the model associations here, such as one-to-many or many-to-many relationships

module.exports = { sequelize, models };

