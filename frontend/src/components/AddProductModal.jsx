import React, { useState } from 'react';

function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Electronics',
    image: '',
    inStock: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || formData.price === '') {
      setErrorMsg('Product name and price are required.');
      return;
    }

    if (parseFloat(formData.price) < 0) {
      setErrorMsg('Price cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddProduct({
        ...formData,
        price: parseFloat(formData.price),
      });
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Electronics',
        image: '',
        inStock: true,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="199.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Wearables">Wearables</option>
                <option value="Audio">Audio</option>
                <option value="Office">Office</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image}
              onChange={handleChange}
            />
            <small className="form-hint">Leave blank to use an auto-assigned high-quality product photo</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Key specifications, features, and warranty details..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <span>In Stock (Available for purchase)</span>
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
