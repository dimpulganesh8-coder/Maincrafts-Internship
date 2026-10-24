import React from 'react';
import './ProductCard.css';

/**
 * ProductCard Component
 * Displays individual product details using props
 * Fulfills Maincrafts Internship Task 1 requirement:
 * "Create a Card component that displays product/user info. Use props to pass data."
 */
function ProductCard({
  id,
  name,
  price,
  description,
  category = 'General',
  image,
  inStock = true,
  onDelete,
}) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';

  const formattedPrice =
    typeof price === 'number'
      ? `$${price.toFixed(2)}`
      : `$${parseFloat(price || 0).toFixed(2)}`;

  return (
    <div className="card product-card">
      <div className="product-card-image-wrap">
        <img
          src={image || fallbackImage}
          alt={name}
          className="product-card-image"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          loading="lazy"
        />
        <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <span className="category-pill">{category}</span>
      </div>

      <div className="product-card-content">
        <div className="product-card-header">
          <h3 className="product-title" title={name}>
            {name}
          </h3>
          <span className="product-price">{formattedPrice}</span>
        </div>

        {description && (
          <p className="product-description" title={description}>
            {description}
          </p>
        )}

        <div className="product-card-footer">
          <button
            className="action-btn buy-btn"
            disabled={!inStock}
            onClick={() => alert(`Added "${name}" to cart!`)}
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>

          {onDelete && (
            <button
              className="action-btn delete-btn"
              title="Delete Product"
              onClick={() => onDelete(id)}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
