const mongoose = require("mongoose");
const Business = require("./Business.model");
const Like = require("./Like.model");

const opportunitySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    title: {
      type: String,
      required: [true, "Name is required"],
    },
    start: {
      type: Date,
      default: "Strating date not defined yet",
    },
    budget: {
      type: String,
      default: "No budget defined for this opportunity",
    },
    duration: {
      type: String,
      enum: ["< 1 month", "1 to 3 months", "> 3 Months"],
	  default: "No duration defined for this opportunity",
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

userSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  //foreignField: 'Business',
  justOne: false,
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
