import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, total, itemCount, coupon, updateQuantity, removeFromCart, clearCart, applyCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async e => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      await applyCoupon(couponCode);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = coupon ? subtotal * (coupon.discount / 100) : 0;
  const finalTotal = subtotal - discount;

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart <span className="cart-count">{itemCount} items</span></h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item._id} className="cart-item">
              <img
                src={item.product.images?.[0] || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <Link to={`/product/${item.product._id}`} className="cart-item-name">
                  {item.product.name}
                </Link>
                <p className="cart-item-category">{item.product.category}</p>
                <div className="cart-item-price">${item.product.price?.toFixed(2)}</div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-subtotal">${(item.product.price * item.quantity).toFixed(2)}</div>
                <button className="remove-item-btn" onClick={() => removeFromCart(item._id)} title="Remove">✕</button>
              </div>
            </div>
          ))}

          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {coupon && (
            <div className="summary-row discount-row">
              <span>Discount ({coupon.code})</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          {/* Coupon */}
          <form className="coupon-form" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Coupon code"
            />
            <button type="submit" disabled={applyingCoupon}>
              {applyingCoupon ? '...' : 'Apply'}
            </button>
          </form>
          {couponError && <p className="coupon-error">{couponError}</p>}
          {coupon && <p className="coupon-success">✓ Coupon applied: {coupon.discount}% off</p>}

          {user ? (
            <Link to="/checkout" className="btn-primary full-width checkout-btn">
              Proceed to Checkout
            </Link>
          ) : (
            <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn-primary full-width checkout-btn">
              Sign in to Checkout
            </Link>
          )}

          <Link to="/shop" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}