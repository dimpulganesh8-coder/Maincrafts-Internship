import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api/products';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from Express + MongoDB API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setBackendConnected(true);
    } catch (err) {
      console.warn('Backend connection notice:', err.message);
      setError(err.message || 'Could not connect to Express API');
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding a new product via POST /api/products
  const handleAddProduct = async (newProductData) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProductData),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to create product');
    }

    const savedProduct = await response.json();
    setProducts((prev) => [savedProduct, ...prev]);
  };

  // Handle deleting a product via DELETE /api/products/:id
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product from server');
      }

      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  // Filter products by search term and category
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="app-layout">
      <Navbar
        onOpenAddModal={() => setIsModalOpen(true)}
        backendConnected={backendConnected}
        productCount={products.length}
      />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="badge-tag">MERN Stack Project</span>
            <h2>Product Catalog & API Integration</h2>
            <p>
              Displaying real-time product records fetched from an Express.js REST API
              powered by MongoDB and rendered via reusable React components.
            </p>
          </div>
        </section>

        {/* Backend offline warning banner if API is unreachable */}
        {!backendConnected && !loading && (
          <div className="alert-banner warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-body">
              <strong>Backend Disconnected (http://localhost:5000)</strong>
              <p>
                To connect the API: open a terminal, run <code>cd backend</code>, then{' '}
                <code>npm start</code>. Make sure MongoDB is running or configure your{' '}
                <code>MONGO_URI</code> in <code>backend/.env</code>.
              </p>
            </div>
            <button className="retry-btn" onClick={fetchProducts}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Search and Filters Bar */}
        <section className="controls-section">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid Area */}
        <section className="catalog-section">
          {loading ? (
            <div className="state-card loading-state">
              <div className="spinner"></div>
              <p>Fetching products from Express & MongoDB...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  id={product._id || product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  category={product.category}
                  image={product.image}
                  inStock={product.inStock}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="state-card empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Products Found</h3>
              <p>
                {searchTerm || selectedCategory !== 'All'
                  ? 'No products matched your current filters.'
                  : 'Your database has no products yet.'}
              </p>
              <div className="empty-actions">
                <button
                  className="primary-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add First Product
                </button>
                <button className="secondary-btn" onClick={fetchProducts}>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <footer className="footer">
        <p>Maincrafts Technology MERN Stack Internship · Task 1: Basic React App + API</p>
      </footer>
    </div>
  );
}

export default App;
