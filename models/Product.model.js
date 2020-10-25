const mongoose = require("mongoose");
const Business = require("./Business.model");
const ProductLike = require("./ProductLike.model");
const Review = require("./Review.model");
const Rating = require("./Rating.model");

const productSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    title: {
      type: String,
      required: [true, "Name is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    paytype: {
      type: String,
      enum: ["Monthly", "Single Pay", "Yearly"],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    web: String,
    business: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Business",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.createdAt;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);

productSchema.virtual('productlikes', {
  ref: 'ProductLike',
  localField: '_id',
  foreignField: 'Product',
});

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'Product',
});

productSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'Product',
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
