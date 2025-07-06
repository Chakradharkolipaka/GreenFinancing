const mongoose = require('mongoose');

const withdrawReviewSchema = new mongoose.Schema({
  amount: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  admin: {
    type: String, // admin email or id
    required: true
  },
  txHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { collection: 'withdrawReviews' });

module.exports = mongoose.model('WithdrawReview', withdrawReviewSchema);
