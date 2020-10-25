
const Product = require("../models/Product.model");
const Business = require("../models/Business.model");
const ProductLike = require("../models/ProductLike.model");
const Review = require("../models/Review.model");

module.exports.create = (req, res, next) => {
  const product = new Product({
    business: req.currentUser.name,
    title: req.body.title,
    price: req.body.price,
    paytype: req.body.paytype,
    image: req.file ? req.file.url : undefined,
    web: req.body.web,
    description: req.body.description,
  })
  
  product.save()
    .then(product => res.status(201).json(product))
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Product.find()
	.sort({createdAt: -1})
	.limit(50)
	.populate('business')
	.populate('productlikes')
	.populate('reviews')
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((e) => next(e));
};

module.exports.show = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .populate('business')
    .populate({
      path: 'reviews',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'business'
      }
    })
    .populate({
      path: 'ratings',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'business'
      }
    })
    .then(product => {
      if (product) {
        res.json(product)
      } else {
        throw createError(404, 'Product not found');
      }
    })
    .catch(next)
}

//Edit product
//Remove Product

module.exports.like = (req, res, next) => {
  const params = { product: req.params.id, business: req.currentUser.id }

  ProductLike.findOne(params)
    .then(like => {
      if (like) {
        ProductLike.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ productlikes: -1 })
          })
          .catch(next)
      } else {
        const like = new ProductLike(params)

        like.save()
          .then(() => {
            res.json({ productlikes: 1})
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.addReview = (req, res, next) => {
  const productId = req.params.id

  const review = new Review({
    text: req.body.text,
    business: req.currentUser.id,
    product: productId
  })
  
  review.save()
    .then(r => res.json(r))
    .catch(next)
}

module.exports.listReviews = (req, res, next) => {
  Review.find()
	.sort({createdAt: -1})
	.limit(20)
	.populate('business')
	.populate('products')
    .then((reviews) => {
      res.status(200).json(reviews);
    })
    .catch((e) => next(e));
};

//Remove Review

module.exports.addRating = (req, res, next) => {
  const productId = req.params.id

  const rating = new Rating({
    score: req.body.score,
    business: req.currentUser.id,
    product: productId
  })
  
  rating.save()
    .then(ra => res.json(ra))
    .catch(next)
}






