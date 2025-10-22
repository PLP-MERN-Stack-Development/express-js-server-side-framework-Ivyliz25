// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  i: {type: String, required: true, unique: true, default: () => require('uuid').v4() },
  name: { type: String, required: true, trim: true, minlength: 2 },
  description: { type: String, required: true, trim: true, minlength: 5 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  inStock: { type: Boolean, required: true, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
