import React from 'react';

function Navbar({ onOpenAddModal, backendConnected, productCount }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">M</div>
          <div>
            <h1 className="brand-title">Maincrafts Shop</h1>
            <p className="brand-subtitle">MERN Stack Internship · Task 1</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div
            className={`connection-pill ${backendConnected ? 'connected' : 'disconnected'}`}
            title={backendConnected ? 'API is online and reachable' : 'Backend API not reachable at http://localhost:5000'}
          >
            <span className="status-dot"></span>
            <span>{backendConnected ? 'Backend Online' : 'Backend Offline'}</span>
          </div>

          <div className="product-count-badge">
            <span>{productCount} Products</span>
          </div>

          <button className="primary-btn add-btn" onClick={onOpenAddModal}>
            <span>+</span> Add Product
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
