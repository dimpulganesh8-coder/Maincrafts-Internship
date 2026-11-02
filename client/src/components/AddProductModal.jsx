import React, { useState } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    description: "",
    imageUrl: "",
    inStock: true,
    rating: "4.8",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter a product name");
      return;
    }
    if (formData.price === "" || Number(formData.price) < 0) {
      setFormError("Please enter a valid price");
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddProduct({
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating || 4.5),
      });
      onClose();
    } catch (err) {
      setFormError(err.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Sparkles size={18} style={{ display: "inline", marginRight: "8px", color: "var(--accent-cyan)" }} />
            Add New Product
          </h3>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div style={{
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: "16px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Wireless Pro Earbuds"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                placeholder="99.99"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
                <option value="Wearables">Wearables</option>
                <option value="Photography">Photography</option>
                <option value="Electronics">Electronics</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Brief product highlights and key specifications..."
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (0.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                className="form-input"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group" style={{ alignSelf: "center", marginTop: "14px" }}>
              <input
                type="checkbox"
                id="inStockCheck"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <label htmlFor="inStockCheck" style={{ margin: 0, cursor: "pointer" }}>
                In Stock & Available
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Creating..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
