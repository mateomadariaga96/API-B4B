const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
	avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    name: {
      type: String,
      required: [true, "Name is required"],
	},
    position: {
      type: String,
      required: [true, "Specify job position"],
	},
    linkedin: {
      type: String,
      default: "No LinkedIn profile"
	},
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
)

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;