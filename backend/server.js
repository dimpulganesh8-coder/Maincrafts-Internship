require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maincrafts_shop';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: If using MongoDB Atlas, make sure MONGO_URI is set in backend/.env with proper credentials and IP whitelist.');
  });

// API Routes
app.use('/api/products', productRoutes);

// Health check / welcome endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Maincrafts Technology MERN Stack API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      getProducts: 'GET /api/products',
      createProduct: 'POST /api/products',
      getProductById: 'GET /api/products/:id',
      updateProduct: 'PUT /api/products/:id',
      deleteProduct: 'DELETE /api/products/:id',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
