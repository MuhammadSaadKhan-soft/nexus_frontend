import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { useWishlist } from '../../hooks/useWishlist';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { pushToast } = useNotifications();
  const { isWishlisted, toggle } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      pushToast(`${product.name} added to cart!`, 'success');
    } catch {
      pushToast('Failed to add to cart', 'error');
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(product._id);
    pushToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        {/* Image */}
        <div className="product-img-wrapper">
          <img
            src={imgError ? '/placeholder-product.jpg' : (product.images?.[0] || '/placeholder-product.jpg')}
            alt={product.name}
            className="product-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Badges */}
          <div className="product-badges">
            {discount && <span className="badge-discount">-{discount}%</span>}
            {product.isNew && <span className="badge-new">New</span>}
            {product.aiRecommended && <span className="badge-ai">✦ AI Pick</span>}
            {product.stock < 5 && product.stock > 0 && (
              <span className="badge-low-stock">Only {product.stock} left</span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="product-hover-actions">
            <button
              className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg width="16" height="16" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>

          {/* Rating */}
          <div className="product-rating">
            <div className="stars">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`star ${s <= Math.round(product.rating || 0) ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="rating-count">({product.reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="product-price-row">
            <span className="product-price">${product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-original-price">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <button
        className={`add-to-cart-btn ${adding ? 'adding' : ''} ${product.stock === 0 ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0 || adding}
      >
        {product.stock === 0 ? 'Out of Stock' : adding ? '✓ Added!' : 'Add to Cart'}
      </button>
    </article>
  );
}
