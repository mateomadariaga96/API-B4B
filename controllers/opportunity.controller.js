const Business = require("../models/Business.model");
const Opportunity = require("../models/Opportunity.model");
const OppLike = require("../models/OppLike.model");
const Comment = require("../models/Comment.model");
const Proposal = require("../models/Proposal.model");

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
	.populate({
      path: 'business',
      populate: {
        path: 'opportunities'
	  }
    })
	.populate('contacts')
	.populate({
      path: 'likes',
      populate: {
        path: 'business'
	  },
      populate: {
        path: 'opportunity'
	  }
    })
	.populate('comments')
	.populate('proposals')
    .then((opportunities) => {
		console.log("Opp:", opportunities);
      res.status(200).json(opportunities);
    })
    .catch((e) => next(e));
};

module.exports.listFiltered = async (req, res, next) => {
	const businesses = await Business.find({sector: req.query.sector}, {_id: 1})

  	Opportunity.find({business: {$in: businesses.map(x => x._id.toString())}})
	.sort({createdAt: -1})
	.limit(50)
	.populate('business')
	.populate('likes')
	.populate('comments')
	.populate('proposals')
    .then((opportunities) => {
      res.status(200).json(opportunities);
    })
    .catch((e) => next(e));
};

module.exports.show = (req, res, next) => {
  Opportunity.findOne({ _id: req.params.id })
    .populate('business')
	//.populate('likes')
	.populate('proposals')
    /* .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'business'
      }
    }) */
    .then(opportunity => {
      if (opportunity) {
		  console.log("hola");
		  Proposal.find({opportunity: opportunity.id})
		  .populate('opportunity')
		  .then(proposal => {
			  const data = { opportunity, proposal}
			  console.log(data);
			  res.json(data)
			  
		  })
        
      } else {
        throw createError(404, 'Opportunity not found');
      }
    })
    .catch(next)
}

module.exports.deleteOpportunity = (req, res, next) => {
    Opportunity.findByIdAndDelete({ _id: req.params.id })
        .then(() => {
            res.json({ message: `Opportunity with id: ${req.params.id} is removed successfully.` });
        })
        .catch(err => next(err))
}

module.exports.updateOpportunity = (req, res, next) => {
  Opportunity.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Opportunity with ${req.params.id} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
}


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

module.exports.addComment = (req, res, next) => {
  const oppId = req.params.id

  const comment = new Comment({
    text: req.body.text,
    business: req.currentUser.id,
    opportunity: oppId
  })
  
  comment.save()
    .then(c => res.json(c))
    .catch(next)
}

module.exports.createProposal = (req, res, next) => {
  const oppId = req.params.id

  const proposal = new Proposal({
    description: req.body.description,
    title: req.body.title,
	status: req.body.status,
    business: req.currentUser.id,
    opportunity: oppId
  })
  
  proposal.save()
    .then(p => res.json(p))
    .catch(next)
}

module.exports.listProposals = (req, res, next) => {
  Proposal.find()
	.sort({createdAt: -1})
	.limit(20)
	.populate('business')
	.populate('opportunities')
    .then((proposals) => {
      res.status(200).json(proposals);
    })
    .catch((e) => next(e));
};

//Remove Proposal


