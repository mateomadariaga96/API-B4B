const Product = require("../models/Product.model");

module.exports.list = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((e) => next(e));
};
