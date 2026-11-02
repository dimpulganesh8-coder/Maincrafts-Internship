import React from "react";
import { Plus, Database, Sparkles, Layers } from "lucide-react";

export default function Navbar({ onOpenAddModal, backendInfo }) {
  const isConnected = backendInfo?.status === "ok";
  const dbLabel = backendInfo?.database || "Checking...";

  return (
    <header className="navbar">
      <div className="container navbar-content">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-badge">M</div>
          <div>
            <div className="brand-title">Maincrafts Technology</div>
            <div className="brand-subtitle">MERN Internship · Task 1</div>
          </div>
        </div>

        {/* Actions & Health Status */}
        <div className="nav-actions">
          {/* Live API Health */}
          <div
            className={`status-badge ${
              backendInfo?.database?.includes("MongoDB") ? "" : "resilient"
            }`}
            title={`Backend: ${backendInfo?.message || "Connecting..."}`}
          >
            <span className="pulse-dot"></span>
            <Database size={13} />
            <span>{isConnected ? dbLabel : "API Offline"}</span>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            id="open-add-product-modal"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </header>
  );
}
