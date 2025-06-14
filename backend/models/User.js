const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  age: Number,
  address: String,
  proofFileName: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
