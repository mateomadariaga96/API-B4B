const mongoose = require("mongoose");
const Business = require("./Business.model");

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

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
