const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [EMAIL_PATTERN, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [10, "Password must have 10 characters or more"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
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

const User = mongoose.model("User", userSchema);

module.exports = User;
