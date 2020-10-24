const createError = require("http-errors");
const Business = require("../models/Business.model");

module.exports.create = (req, res, next) => {
  const user = new Business({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    logo: req.file ? req.file.url : undefined,
    size: req.body.size,
    sector: req.body.description,
    type: req.body.type,
    web: req.body.web,
    linkedin: req.body.linkedin,
  })

  user.save()
    .then((user) => res.status(201).json(user))
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Business.find()
    .then((business) => {
      res.status(200).json(business);
    })
    .catch((e) => next(e));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError(400, "Missing credentials"); 
  }
  Business.findOne({ email })
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
