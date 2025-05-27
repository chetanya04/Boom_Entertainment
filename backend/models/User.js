const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firebaseId: { type: String, required: true, unique: true }, 
  name: String,
  email: String,
  walletBalance: { type: Number, default: 500 },
  // Fixed reference - change 'VideoBoom' to 'Video' (or whatever your video model is called)
  purchasedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);