const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const Product = require("./Product.model");
const Contact = require("./Contact.model");
const Opportunity = require("./Opportunity.model");
const Proposal = require("./Proposal.model");
const Chat = require("./Chat.model");


const businessSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [EMAIL_PATTERN, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must have 8 characters or more"],
    },
     logo: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    name: {
      type: String,
      required: [true, "Business Name is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    size: {
      type: String,
      enum: ["0 to 10 employees", "10 to 50 employees", "50 to 250 employees", "+250 employees"]
      required: [true, "Company's size is required"],
    },
    sector: {
      type: String,
      enum: ["AI/ML", "Blockchain", "Cybersecurity", "Digital Marketing", "Industry 4.0 & Automation", "IoT", "RPA", "Software Development", "Telecoms", "QA & Testing"]
      required: [true, "Tell us about your sector"],
    },
    description: {
      type: String,
      default: "There is not a company description yet.",
      maxLength: 500
    },
    type: {
      type: String,
      enum: ["Service provider", "Product vendor"],
      required: [true, "Business type is required"]
    },
    web: {
      type: String,
      default: "No website yet",
    },
    linkedin: {
      type: String,
      default: "No LinkedIn yet",
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.password;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.createdAt;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);

userSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  justOne: false,
});

userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'Business',
  justOne: false,
});

userSchema.virtual('opportunities', {
  ref: 'Opportunity',
  localField: '_id',
  foreignField: 'Business',
  justOne: false,
});

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    // Hash password
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then((salt) => {
        return bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash;
          next();
        });
      })
      .catch((e) => next(e));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  console.log(password);
  console.log(this.password);
  return bcrypt.compare(password, this.password);
};

const Business = mongoose.model("User", businessSchema);

module.exports = Business;
