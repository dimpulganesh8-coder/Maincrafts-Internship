import React from "react";
import { Star, Trash2, Tag, CheckCircle2, XCircle } from "lucide-react";

/**
 * ProductCard Component (Maincrafts MERN Internship - Task 1)
 * Uses props to display product details within a responsive card layout.
 */
export default function ProductCard({
  id,
  name,
  price,
  category = "General",
  description = "",
  imageUrl,
  inStock = true,
  rating = 4.5,
  onDelete,
}) {
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : Number(price || 0).toFixed(2);
  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="card" id={`product-card-${id}`}>
      {/* Product Image & Badges */}
      <div className="card-image-wrap">
        <img
          src={imageUrl || fallbackImg}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
          }}
        />
        <span className="card-category-badge">
          <Tag size={12} style={{ display: "inline", marginRight: "4px" }} />
          {category}
        </span>
        <span className={`card-stock-badge ${inStock ? "stock-in" : "stock-out"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Rating Stars */}
        <div className="card-rating">
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>{rating ? rating.toFixed(1) : "4.5"}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: "4px", fontSize: "0.75rem" }}>
            (Verified)
          </span>
        </div>

        {/* Product Name (From Task 1 requirements) */}
        <h3>{name}</h3>

        {/* Product Description */}
        <p className="card-desc">
          {description || "High performance product engineered for modern digital lifestyle."}
        </p>

        {/* Footer with Price and Actions */}
        <div className="card-footer">
          <div className="card-price-block">
            <span className="price-label">Price</span>
            <span className="price-value">${formattedPrice}</span>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="btn btn-danger-outline"
              title="Delete Product"
              aria-label={`Delete ${name}`}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
