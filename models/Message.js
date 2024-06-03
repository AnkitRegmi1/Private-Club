const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: String,
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Storing user IDs
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Message', messageSchema);
