const Proposal = require("../models/Proposal.model");

module.exports.list = (req, res, next) => {
  Proposal.find()
    .then((proposal) => {
      res.json(proposal);
    })
    .catch((e) => next(e));
};