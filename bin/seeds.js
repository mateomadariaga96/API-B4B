require("../config/db.config");
const Business = require("../models/Business.model");
const Product = require("../models/Product.model");
const Opportunity = require("../models/Opportunity.model");
const faker = require("faker");

const userIds = [];
const userN = 40;

Promise.all([Business.deleteMany(), Product.deleteMany()])
  .then(() => {
    for (let i = 0; i < userN; i++) {

      const size = ["0 to 10 employees", "10 to 50 employees", "50 to 250 employees", "+250 employees"]
      const sector = ["AI/ML", "Blockchain", "Cybersecurity", "Digital Marketing", "Industry 4.0 & Automation", "IoT", "RPA", "Software Development", "Telecoms", "QA & Testing"]
      const type = ["Service provider", "Product vendor"]
      const pay = ["Monthly", "Single Pay", "Yearly"]
      const dur = ["< 1 month", "1 to 3 months", "> 3 Months"]

      const user = new Business({
        email: faker.internet.email(),
        password: "1234567890",
        name: faker.company.companyName(),
        location: faker.address.city(),
        logo: faker.image.business(),
        size: size[Math.floor(Math.random() * size.length)],
        sector: sector[Math.floor(Math.random() * sector.length)],
        type: type[Math.floor(Math.random() * type.length)],
        description: faker.lorem.paragraphs(),
      });
      user.save()
        .then((u) => {
            console.log(u.name);
            if (user.type === "Product vendor") {
              for (let i = 0; i < 4; i++) {
                const product = new Product({
                  title: faker.commerce.productName(),
                  description: faker.lorem.paragraph(),
                  price: faker.commerce.price(),
                  paytype: pay[Math.floor(Math.random() * pay.length)],
                  business: u._id,
                });
                product
                  .save()
                  .then((p) => {
                    console.log(p);
                  })
                  .catch((e) => console.log(e));
              }
            } 
            if (user.type === "Service provider") {
              for (let i = 0; i < 2; i++) {
                const opportunity = new Opportunity({
                  title: faker.lorem.sentence(),
                  description: faker.lorem.paragraph(),
                  duration: dur[Math.floor(Math.random() * dur.length)],
                  business: u._id,
                });
                opportunity
                  .save()
                  .then((o) => {
                    console.log(o);
                  })
                  .catch((e) => console.log(e));
              }
            }
          })
        .catch((e) => console.log(e));
      console.log(user);
    }
  })
  .catch((e) => console.log(e));