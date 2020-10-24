const mongoose = require('mongoose');

const opplikeSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})

const OppLike = mongoose.model('OppLike', opplikeSchema);

module.exports = OppLike;