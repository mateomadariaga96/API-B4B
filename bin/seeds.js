require("../config/db.config");
const Business = require("../models/Business.model");
const Product = require("../models/Product.model");
const Opportunity = require("../models/Opportunity.model");
const OppLike = require("../models/OppLike.model");
const Comment = require("../models/Comment.model");
const Proposal = require("../models/Proposal.model");
const Review = require("../models/Review.model");
const Rating = require("../models/Rating.model");
const ProductLike = require("../models/ProductLike.model");
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
          userIds.push(user._id)
            //console.log(u.name);
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
                    //console.log(p);
                    for (let m = 0; Math.floor(Math.random() * 20); m++) {
                      const productlike = new ProductLike({
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        product: p._id,
                      });
                      productlike.save()
                    }
                    
                    for (let n = 0; Math.floor(Math.random() * 10); n++) {
                      const review = new Review({
                        text: faker.lorem.paragraph(),
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        product: p._id,
                      });
                      review.save()
                      //console.log(review);
                    }

                    for (let q = 0; Math.floor(Math.random() * 20); q++) {
                      const rating = new Rating({
                        score: Math.floor(Math.random() * 5),
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        product: p._id,
                      });
                      rating.save()
                      //console.log(rating);
                    }
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
                    //console.log(o);
                    for (let k = 0; Math.floor(Math.random() * 20); k++) {
                      const like = new OppLike({
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        opportunity: o._id,
                      });
                      like.save()
                    }
                    

                    for (let j = 0; Math.floor(Math.random() * 10); j++) {
                      const comment = new Comment({
                        text: faker.lorem.paragraph(),
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        opportunity: o._id,
                      });
                      comment.save()
                      //console.log(comment);
                    }

                    for (let l = 0; Math.floor(Math.random() * 10); l++) {
                      const proposal = new Proposal({
                        description: faker.lorem.paragraphs(),
                        title: faker.lorem.sentence(),
                        status: 'pending',
                        business: userIds[Math.floor(Math.random() * userIds.length)],
                        opportunity: o._id,
                      });
                      proposal.save()
                      console.log(proposal);
                    }
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