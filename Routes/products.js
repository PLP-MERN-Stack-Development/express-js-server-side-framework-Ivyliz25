// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { NotFoundError } = require('../Utils/errors');
const { validateProduct } = require('../Middleware/validateProduct');
const { auth } = require('../Middleware/auth');

// GET /api/products
// supports ?category=&search=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let page = parseInt(req.query.page || '1', 10);
    let limit = parseInt(req.query.limit || '10', 10);
    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products (protected)
router.post('/', auth, validateProduct, async (req, res, next) => {
  try {
    const obj = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: req.body.price,
      category: req.body.category.trim(),
      inStock: req.body.inStock
    };
    const created = await Product.create(obj);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id (protected)
router.put('/:id', auth, validateProduct, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        price: req.body.price,
        category: req.body.category.trim(),
        inStock: req.body.inStock
      },
      { new: true, runValidators: true }
    );
    if (!updated) throw new NotFoundError('Product not found');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id (protected)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) throw new NotFoundError('Product not found');
    res.json({ message: 'Deleted', product: deleted });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?q=term
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ total: 0, data: [] });
    const found = await Product.find({ name: { $regex: q, $options: 'i' } });
    res.json({ total: found.length, data: found });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats
router.get('/stats', async (req, res, next) => {
  try {
    const agg = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);
    const total = await Product.countDocuments();
    res.json({ total, byCategory: agg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
