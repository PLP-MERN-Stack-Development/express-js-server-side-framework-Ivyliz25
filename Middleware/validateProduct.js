// middleware/validateProduct.js
const { ValidationError } = require('../Utils/errors');

function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name: required, min 2 characters');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    errors.push('description: required, min 5 characters');
  }
  if (price === undefined || typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    errors.push('price: required, must be a non-negative number');
  }
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('category: required, string');
  }
  if (inStock === undefined || typeof inStock !== 'boolean') {
    errors.push('inStock: required, boolean');
  }

  if (errors.length) {
    return next(new ValidationError('Invalid product payload', errors));
  }
  next();
}

module.exports = { validateProduct };

