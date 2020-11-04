const createError = require("http-errors");
const Business = require("../models/Business.model");
const Comment = require("../models/Comment.model");
const Product = require("../models/Product.model");
const Opportunity = require("../models/Opportunity.model");
const OppLike = require("../models/OppLike.model");
const ProductLike = require("../models/ProductLike.model");
const Contact = require("../models/Contact.model");
const Review = require("../models/Review.model");

module.exports.create = (req, res, next) => {
  console.log(req.body);
  const user = new Business({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    logo: req.file ? req.file.url : undefined,
    location: req.body.location,
    size: req.body.size,
    sector: req.body.sector,
    type: req.body.type,
    web: req.body.web,
    linkedin: req.body.linkedin,
  })

  user.save()
    .then((user) => res.status(201).json(user))
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Business.find(req.query)
  .populate('opportunities')
  .populate('products')
  .populate('likes')
  .populate('productlikes')
  .populate('contacts')
  .populate('comments')
  .populate('reviews')
    .then((business) => {
      res.status(200).json(business);
    })
    .catch((e) => next(e));
};

module.exports.profile = (req, res, next) => {
  const {id} = req.params
  console.log(id);
  console.log(req.params);
  Business.findById(id)
    .populate('opportunities')
    .populate('products')
    .populate('likes')
    .populate('productlikes')
    .populate('contacts')
    .populate('comments')
    .populate('reviews')
    .then(business => {
      if (business) {
        console.log(business);
        res.json(business)
        
      } else {
        throw createError(404, 'business not found');
      }
    })
    .catch(next)
}

module.exports.deleteBusiness = (req, res, next) => {
    Business.findByIdAndDelete({ _id: req.params.id })
        .then(() => {
            res.json({ message: `Business with id: ${req.params.id} is removed successfully.` });
        })
        .catch(err => next(err))
}

module.exports.updateBusiness = (req, res, next) => {
  Business.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Business with ${req.params.id} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
}

//update

module.exports.createContact = (req, res, next) => {

  const contact = new Contact({
    name: req.body.name,
    avatar: req.file ? req.file.url : undefined,
    position: req.body.position,
    business: req.currentUser.id,
    linkedin: req.body.linkedin,
  })

  contact.save()
    .then((contact) => res.status(201).json(contact))
    .catch(next)
}

//DUDA CON LIST YA QUE ESTÁ EN VIRTUALS Y POPULADO

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError(400, "Missing credentials"); 
  }
  Business.findOne({ email })
  .populate('opportunities')
  .populate('likes')
  .populate('comments')
  .populate('proposals')
  .populate('contacts')
    .then((user) => {
      if (!user) {
        throw createError(400, "Wrong credentials");
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            throw createError(400, "Wrong credentials");
          } else {
            req.session.user = user;
            res.status(200).json(user);
          }
        });
      }
    })
    .catch((e) => next(e));
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.status(204).json();
}
