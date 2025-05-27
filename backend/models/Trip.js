const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    name: { type: String, required: true },
  place: { type: String },
  title: String,
  price: Number,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
