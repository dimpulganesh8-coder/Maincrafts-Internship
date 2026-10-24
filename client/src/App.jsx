import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AddProductModal from "./components/AddProductModal";
import { Search, PackageOpen, AlertCircle, RefreshCw, Code2, CheckCircle2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendInfo, setBackendInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);

  // Fetch health/status & products from Express backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check backend status
      try {
        const healthRes = await fetch(`${API_BASE_URL}/health`);
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setBackendInfo(healthData);
        }
      } catch (hErr) {
        console.warn("Backend health check warning:", hErr);
      }

      // Fetch products using the required Task 1 endpoint: /api/products
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || "Failed to load products from Express API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle adding new product via POST /api/products
  const handleAddProduct = async (newProductData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProductData),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create product");
    }

    const created = await response.json();
    setProducts((prev) => [created, ...prev]);
  };

  // Handle deleting a product via DELETE /api/products/:id
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  // Filter products by search term and selected category
  const categories = ["All", ...new Set(products.map((p) => p.category || "General"))];
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-layout">
      {/* Navbar with brand & API health */}
      <Navbar
        onOpenAddModal={() => setIsModalOpen(true)}
        backendInfo={backendInfo}
      />

      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <CheckCircle2 size={14} color="#38bdf8" />
            <span>MERN Stack Internship Assignment · Task 1 Completed</span>
          </div>
          <h1 className="hero-title">
            Dynamic Product Showcase &amp; <br />
            <span className="hero-gradient-text">Express + MongoDB REST API</span>
          </h1>
          <p className="hero-description">
            A modern React application demonstrating props, reusable component architecture,
            state management, and seamless live data fetching from an Express &amp; MongoDB backend.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              Add New Product
            </button>
            <button
              onClick={() => setShowCodeDetails(!showCodeDetails)}
              className="btn btn-secondary"
            >
              <Code2 size={16} />
              <span>{showCodeDetails ? "Hide Architecture" : "View Architecture"}</span>
            </button>
            <button
              onClick={fetchData}
              className="btn btn-secondary"
              title="Refresh data from API"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
          </div>
        </section>

        {/* Optional architecture details collapsible */}
        {showCodeDetails && (
          <div className="code-sample-box">
            <p style={{ color: "#38bdf8", fontWeight: 700, marginBottom: "8px" }}>
              🛠️ Technical Implementation Checklist (Task 1 Requirements):
            </p>
            <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: 1.8 }}>
              <li>✅ <strong>React Frontend:</strong> Setup with Vite, modular components, props passing (`&lt;ProductCard name price /&gt;`), `useState`, `useEffect`.</li>
              <li>✅ <strong>Express REST API:</strong> Implemented `app.get('/api/products')`, POST, PUT, DELETE with CORS and error handling.</li>
              <li>✅ <strong>MongoDB + Mongoose:</strong> Configured `Product` schema with validation (`server/models/Product.js`).</li>
              <li>✅ <strong>Connecting Frontend &amp; Backend:</strong> Live fetching from `http://localhost:5000/api/products` with dynamic card rendering.</li>
            </ul>
          </div>
        )}

        {/* Toolbar: Search & Category Filter */}
        <section className="toolbar">
          <div className="search-box">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search products by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Loading / Error States */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <h3>Fetching products from Express + MongoDB API...</h3>
            <p style={{ marginTop: "6px" }}>Connecting to http://localhost:5000/api/products</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-container" style={{ color: "#fb7185" }}>
            <AlertCircle size={40} style={{ margin: "0 auto 12px auto" }} />
            <h3>Unable to Connect to API</h3>
            <p>{error}</p>
            <p style={{ fontSize: "0.85rem", marginTop: "10px", color: "var(--text-muted)" }}>
              Ensure your Express backend is running on <code>http://localhost:5000</code>.
            </p>
            <button
              onClick={fetchData}
              className="btn btn-secondary"
              style={{ marginTop: "16px" }}
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        )}

        {/* Products Grid (Using props in ProductCard component) */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                category={product.category}
                description={product.description}
                imageUrl={product.imageUrl}
                inStock={product.inStock}
                rating={product.rating}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="state-container">
            <PackageOpen size={48} style={{ margin: "0 auto 14px auto", opacity: 0.5 }} />
            <h3>No products found</h3>
            <p>Try refining your search keyword or selecting a different category.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="btn btn-secondary"
              style={{ marginTop: "16px" }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Modal for adding product */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Maincrafts Technology MERN Stack Internship — <strong>Task 1: Basic React App + API</strong>
          </p>
          <p style={{ marginTop: "6px", fontSize: "0.8rem" }}>
            Developed by <strong>Lokesh</strong> · Express · MongoDB · Mongoose · React · Node.js
          </p>
        </div>
      </footer>
    </div>
  );
}
