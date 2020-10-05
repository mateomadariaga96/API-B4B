require("../config/db.config");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const faker = require("faker");

const userIds = [];
const userN = 30;
const productN = 5;

Promise.all([User.deleteMany(), Product.deleteMany()])
  .then(() => {
    for (let i = 0; i < userN; i++) {
      const user = new User({
        email: faker.internet.email(),
        password: "1234567890",
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
      });
      user
        .save()
        .then((u) => {
          console.log(u.email);
          for (let i = 0; i < productN; i++) {
            const product = new Product({
              name: faker.commerce.productName(),
              description: faker.lorem.paragraph(),
              price: faker.commerce.price(),
              user: u._id,
            });
            product
              .save()
              .then((p) => {
                console.log(p.name);
              })
              .catch((e) => console.log(e));
          }
        })
        .catch((e) => console.log(e));
    }
  })
  .catch((e) => console.log(e));
