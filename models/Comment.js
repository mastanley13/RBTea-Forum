// models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  comment: { type: String, required: true, maxlength: 500 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);