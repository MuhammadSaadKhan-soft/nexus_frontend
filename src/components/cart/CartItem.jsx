import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { pushToast } = useNotifications();
  const [updating, setUpdating] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuantity = async (newQty) => {
    if (newQty < 1) return;
    setUpdating(true);
    try {
      await updateQuantity(item._id, newQty);
    } catch {
      pushToast('Failed to update quantity', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item._id);
      pushToast(`${item.product?.name} removed from cart`, 'info');
    } catch {
      pushToast('Failed to remove item', 'error');
    }
  };

  const product = item.product || {};
  const subtotal = (product.price || 0) * item.quantity;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="cart-item-img-link">
        <img
          src={imgError ? '/placeholder-product.jpg' : (product.images?.[0] || '/placeholder-product.jpg')}
          alt={product.name}
          className="cart-item-img"
          onError={() => setImgError(true)}
        />
      </Link>

      {/* Product Info */}
      <div className="cart-item-info">
        <Link to={`/product/${product._id}`} className="cart-item-name">
          {product.name}
        </Link>
        {item.variant && (
          <p className="cart-item-variant">{item.variant}</p>
        )}
        <p className="cart-item-category">{product.category}</p>

        {/* Mobile price */}
        <p className="cart-item-price-mobile">${product.price?.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className={`cart-item-qty ${updating ? 'updating' : ''}`}>
        <button
          className="qty-btn"
          onClick={() => handleQuantity(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => handleQuantity(item.quantity + 1)}
          disabled={updating || item.quantity >= (product.stock || 99)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Unit Price */}
      <div className="cart-item-price">
        ${product.price?.toFixed(2)}
      </div>

      {/* Subtotal */}
      <div className="cart-item-subtotal">
        ${subtotal.toFixed(2)}
      </div>

      {/* Remove */}
      <button
        className="cart-item-remove"
        onClick={handleRemove}
        aria-label="Remove item"
        title="Remove"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}