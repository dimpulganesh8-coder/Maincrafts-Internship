require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maincrafts_shop';

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    description: 'Premium over-ear headphones with active noise cancellation and 40-hour battery life.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    description: 'RGB backlit mechanical keyboard with tactile switches and aerospace-grade aluminum frame.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
  {
    name: 'Ultra-HD Smart Watch',
    price: 249.00,
    description: 'Fitness tracker with AMOLED always-on display, heart-rate monitor, and GPS tracking.',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
  {
    name: 'Ergonomic Vertical Mouse',
    price: 49.99,
    description: 'Wireless ergonomic mouse designed to reduce wrist strain during long coding sessions.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    inStock: false,
  },
  {
    name: 'Minimalist Aluminum Laptop Stand',
    price: 39.99,
    description: 'Sleek heat-dissipating riser compatible with all 11-17 inch laptops and MacBooks.',
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 79.95,
    description: 'IPX7 waterproof wireless speaker delivering 360-degree immersive bass sound.',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${created.length} sample products!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedData();
