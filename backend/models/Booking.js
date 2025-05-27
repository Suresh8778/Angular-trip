const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  email: String,
  tripPlace: [String],  // array of strings
  name: String,
  email: String,
  bookingDate: Date,
  persons: Number,
  totalPrice: Number,
  proof: String
});


module.exports = mongoose.model('Booking', bookingSchema);
