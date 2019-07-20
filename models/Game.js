const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  roomName: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Game = mongoose.model('game', GameSchema);
