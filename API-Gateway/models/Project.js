const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  description: String,
  urls: [String],
  location: String,
  startDate: String,
  endDate: String,
  projectType: String,
  budget: String,
  team: String,
  impact: String,
  esgScore: String,
  carbonCredits: String,
  additionalInfo: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'projects' });

module.exports = mongoose.model('Project', projectSchema);