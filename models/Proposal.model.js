const mongoose = require("mongoose");
const Business = require("./Business.model");
const Opportunity = require("./Opportunity.model")

const proposalSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    title: {
      type: String,
      required: [true, "Name is required"],
    },
    status: {
      type: String, 
      enum : ['pending', 'accepted', 'denied'], 
      default: 'pending' 
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Opportunity",
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

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;