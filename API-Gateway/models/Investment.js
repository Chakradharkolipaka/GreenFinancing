const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  contributor: String,
  amount: String, // Store as string to avoid JS number issues
  txHash: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'investments' });

module.exports = mongoose.model('Investment', investmentSchema);