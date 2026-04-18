import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CartSummary() {
  const { items, total, coupon, applyCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { pushToast } = useNotifications();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const discount = coupon ? subtotal * (coupon.discountPercent / 100) : 0;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const finalTotal = subtotal - discount + shipping;

  const handleCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponCode.trim().toUpperCase());
      pushToast('Coupon applied!', 'success');
      setCouponCode('');
    } catch {
      pushToast('Invalid or expired coupon', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-summary">
      <h2 className="cart-summary-title">Order Summary</h2>

      {/* Line Items */}
      <div className="cart-summary-lines">
        <div className="summary-line">
          <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {coupon && (
          <div className="summary-line discount">
            <span>Discount ({coupon.discountPercent}% off)</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-line">
          <span>Shipping</span>
          <span>{shipping === 0 ? (
            <span className="free-shipping">FREE</span>
          ) : `$${shipping.toFixed(2)}`}</span>
        </div>

        {subtotal < 75 && subtotal > 0 && (
          <p className="free-shipping-hint">
            Add ${(75 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}

        <div className="summary-divider" />

        <div className="summary-line total">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon */}
      {!coupon && (
        <form className="coupon-form" onSubmit={handleCoupon}>
          <input
            type="text"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="coupon-input"
            maxLength={20}
          />
          <button
            type="submit"
            className="coupon-btn"
            disabled={couponLoading || !couponCode.trim()}
          >
            {couponLoading ? '...' : 'Apply'}
          </button>
        </form>
      )}

      {coupon && (
        <div className="coupon-applied">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Code <strong>{coupon.code}</strong> applied</span>
        </div>
      )}

      {/* Checkout Button */}
      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* Secure badges */}
      <div className="cart-badges">
        <span className="cart-badge">🔒 Secure Checkout</span>
        <span className="cart-badge">↩ Free Returns</span>
      </div>
    </div>
  );
}