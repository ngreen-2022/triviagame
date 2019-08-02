const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  highScore:{
    type: Number,
    default: 0
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
