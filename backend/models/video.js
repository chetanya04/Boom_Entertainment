const mongoose = require('mongoose');
const {Schema} = mongoose;

const VideoSchema = new Schema({
  title: String,
  description: String,
  type: String,
  creatorId: String,
  localFilePath: String, 
  videoUrl: String,      
  price: Number
}, { timestamps: true }); 

module.exports = mongoose.model('VideoBoom', VideoSchema); 