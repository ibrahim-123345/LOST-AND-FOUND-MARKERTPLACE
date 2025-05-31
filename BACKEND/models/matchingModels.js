// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  lostItemId: String,
  foundItemId: String,
  lostUser: {
    username: String,
    email: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  foundUser: {
    username: String,
    email: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  matchScore: Number,
  status: String,
  explanation: String
});

module.exports = mongoose.model('Match', matchSchema);
