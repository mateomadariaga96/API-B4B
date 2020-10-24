const Opportunity = require("../models/Opportunity.model");
const Business = require("../models/Business.model");
const OppLike = require("../models/OppLike.model");

module.exports.create = (req, res, next) => {
  const opportunity = new Opportunity({
    business: req.currentUser.name,
    title: req.body.title,
    start: req.body.start,
    budget: req.body.budget,
    duration: req.body.duration,
  })
  
  opportunity.save()
    .then(opportunity => res.status(201).json(opportunity))
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Opportunity.find()
	.sort({createdAt: -1})
	.limit(50)
	//.populate('business')
	.populate('likes')
	//.populate('comments')
    .then((opportunities) => {
      res.status(200).json(opportunities);
    })
    .catch((e) => next(e));
};

module.exports.like = (req, res, next) => {
  const params = { opportunity: req.params.id, business: req.currentUser.id }

  OppLike.findOne(params)
    .then(like => {
      if (like) {
        OppLike.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ likes: -1 })
          })
          .catch(next)
      } else {
        const like = new OppLike(params)

        like.save()
          .then(() => {
            res.json({ likes: 1})
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.show = (req, res, next) => {
  Opportunity.findOne({ _id: req.params.id })
    .populate('business')
    .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'business'
      }
    })
    .then(opportunity => {
      if (opportunity) {
        res.json(opportunity)
      } else {
        throw createError(404, 'Opportunity not found');
      }
    })
    .catch(next)
}
