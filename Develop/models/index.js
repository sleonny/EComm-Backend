const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig.options
);

const models = {
  Category: require("./category"),
  Product: require("./product"),
  Tag: require("./tag"),
  ProductTag: require("./productTag"),
};

// Define the model associations here, such as one-to-many or many-to-many relationships
models.Product.belongsTo(models.Category, { foreignKey: "category_id" });
models.Category.hasMany(models.Product, { foreignKey: "category_id" });

models.Product.belongsToMany(models.Tag, {
  through: models.ProductTag,
  foreignKey: "product_id",
});
models.Tag.belongsToMany(models.Product, {
  through: models.ProductTag,
  foreignKey: "tag_id",
});

module.exports = { sequelize, models };
