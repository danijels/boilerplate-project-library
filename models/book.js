const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BookSchema = new Schema({
  'title': { type: String, required: true },
  'comments': { type: Array, default: [] }
});

module.exports = model('Book', BookSchema);