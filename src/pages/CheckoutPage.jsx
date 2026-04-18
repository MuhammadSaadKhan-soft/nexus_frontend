import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';

export default function CheckoutPage() {
  const { items, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirm
  const [shipping, setShipping] = useState({
    street: '', city: '', state: '', country: '', zipCode: '',
  });
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = coupon ? subtotal * (coupon.discount / 100) : 0;
  const total = subtotal - discount;

  const handleShippingChange = e => setShipping(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePaymentChange = e => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.create({
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity, variant: i.variant })),
        shippingAddress: shipping,
        paymentMethod: payment.method,
        coupon: coupon?.code,
        total,
      });
      await clearCart();
      navigate(`/orders`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>

      {/* Step Indicator */}
      <div className="checkout-steps">
        {['Shipping', 'Payment', 'Confirm'].map((label, i) => (
          <div key={label} className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
            <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
            <span className="step-label">{label}</span>
            {i < 2 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-area">
          {/* Step 1 – Shipping */}
          {step === 1 && (
            <div className="checkout-step-content">
              <h2>Shipping Address</h2>
              {['street', 'city', 'state', 'country', 'zipCode'].map(field => (
                <div key={field} className="form-group">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    name={field}
                    value={shipping[field]}
                    onChange={handleShippingChange}
                    required
                    placeholder={`Your ${field}`}
                  />
                </div>
              ))}
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={Object.values(shipping).some(v => !v.trim())}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 – Payment */}
          {step === 2 && (
            <div className="checkout-step-content">
              <h2>Payment</h2>
              <div className="payment-methods">
                {['card', 'paypal', 'cod'].map(method => (
                  <label key={method} className={`payment-option ${payment.method === method ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      checked={payment.method === method}
                      onChange={handlePaymentChange}
                    />
                    {method === 'card' ? '💳 Credit/Debit Card' : method === 'paypal' ? '🅿️ PayPal' : '💵 Cash on Delivery'}
                  </label>
                ))}
              </div>
              {payment.method === 'card' && (
                <div className="card-fields">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry</label>
                      <input type="text" name="expiry" value={payment.expiry} onChange={handlePaymentChange} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" name="cvv" value={payment.cvv} onChange={handlePaymentChange} placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}
              <div className="step-nav">
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3 – Confirm */}
          {step === 3 && (
            <div className="checkout-step-content">
              <h2>Review Your Order</h2>
              <div className="order-review-items">
                {items.map(item => (
                  <div key={item._id} className="order-review-item">
                    <img src={item.product.images?.[0] || '/placeholder-product.jpg'} alt={item.product.name} />
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-review-address">
                <strong>Shipping to:</strong> {shipping.street}, {shipping.city}, {shipping.state}, {shipping.country} {shipping.zipCode}
              </div>
              <div className="order-review-payment">
                <strong>Payment:</strong> {payment.method === 'card' ? 'Credit/Debit Card' : payment.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
              </div>
              {error && <div className="auth-error">{error}</div>}
              <div className="step-nav">
                <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map(item => (
            <div key={item._id} className="summary-item">
              <span>{item.product.name} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {coupon && <div className="summary-row discount-row"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
          <div className="summary-row"><span>Shipping</span><span className="free-shipping">Free</span></div>
          <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}