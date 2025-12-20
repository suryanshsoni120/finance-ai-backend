const categories = require("../config/categories");

exports.getCategories = (req, res) => {
  res.json(categories);
};