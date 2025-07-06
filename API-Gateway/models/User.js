const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: String,
  organization: String
}, { collection: 'users' }); // <-- sets the collection name

module.exports = mongoose.model('User', userSchema);