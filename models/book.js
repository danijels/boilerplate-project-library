const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BookSchema = new Schema({
  'title': { type: String, required: true },
  'author': { type: String, default: 'NN' },
  'comments': [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = model('Book', BookSchema);