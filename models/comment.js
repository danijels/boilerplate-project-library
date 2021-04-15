const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  'content': { type: String, required: true },
  'date': { type: Date, default: Date.now },
  'book': { type: Schema.Types.ObjectID, required: true }
});

module.exports = model('Comment', CommentSchema);
