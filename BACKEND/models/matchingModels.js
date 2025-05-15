// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  lostItemId: String,
  foundItemId: String,
  lostUser: {
    username: String,
    email: String
  },
  foundUser: {
    username: String,
    email: String
  },
  matchScore: Number,
  status: String,
  explanation: String
});

module.exports = mongoose.model('Match', matchSchema);
