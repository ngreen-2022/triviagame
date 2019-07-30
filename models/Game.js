const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  roomName: {
    type: String,
    required: true
  },
  isPlaying: {
    type: Boolean
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  // players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  players: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      playerName: {
        type: String
      },
      playerAvatar: {
        type: String
      },
      score: {
        type: Number,
        default: 0
      }
    }
  ],
  curQuestion: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Game = mongoose.model('game', GameSchema);
