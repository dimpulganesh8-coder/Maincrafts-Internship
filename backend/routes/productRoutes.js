const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (matches assignment starter code)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, category, image, inStock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: 'Name and price are required fields',
      });
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      description: description || '',
      category: category || 'General',
      image: image || undefined,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create product',
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update product',
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message,
    });
  }
});

module.exports = router;
