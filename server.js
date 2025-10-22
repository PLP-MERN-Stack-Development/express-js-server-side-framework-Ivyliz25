// server.js - entry point
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const productRoutes = require('./Routes/products');
const { logger } = require('./Middleware/logger');
const { errorHandler } = require('./Middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/WEEK2_DB';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message || err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome — Week 2 Express API (GreenShift)' });
});

// API routes
app.use('/api/products', productRoutes);

// Global error handler (last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
