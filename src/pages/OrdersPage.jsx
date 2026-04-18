import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../api';

const STATUS_COLORS = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const TIMELINE_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const TIMELINE_LABELS = { pending: 'Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };

const PAYMENT_LABELS = {
  cod: 'Cash on Delivery',
  card: 'Credit / Debit Card',
  bank: 'Bank Transfer',
};

function StatusTimeline({ currentStatus }) {
  if (currentStatus === 'cancelled') return null;
  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  return (
    <div className="order-status-timeline">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="tl-step">
              <div className={`tl-dot ${isDone ? 'done' : isActive ? 'active' : ''}`} />
              <span className={`tl-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                {TIMELINE_LABELS[step]}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`tl-line ${isDone ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    orderAPI.getAll()
      .then(res => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await orderAPI.cancel(orderId);
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? {
                ...o,
                status: 'cancelled',
                statusHistory: [
                  ...o.statusHistory,
                  { status: 'cancelled', note: 'Cancelled by customer', timestamp: new Date().toISOString() },
                ],
              }
            : o
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1 className="page-title">My Orders</h1>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your orders will appear here once you make a purchase.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">
        My Orders
        <span className="order-page-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </h1>

      <div className="orders-list">
        {orders.map(order => {
          const latestNote = order.statusHistory?.[order.statusHistory.length - 1]?.note;
          const shippingAddr = order.shippingAddress;
          const addrLine = shippingAddr
            ? [shippingAddr.street, shippingAddr.city].filter(Boolean).join(', ')
            : null;

          return (
            <div key={order._id} className="order-card">
              {/* ── Header ── */}
              <div className="order-card-header">
                <div className="order-meta">
                  <p className="order-id">
                    Order
                    <span className="order-number-tag">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                  </p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="order-header-right">
                  <span className={`order-status ${STATUS_COLORS[order.status] || ''}`}>
                    <span className="status-dot" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    {latestNote && <span className="status-note">· {latestNote}</span>}
                  </span>
                </div>
              </div>

              {/* ── Status Timeline ── */}
              <StatusTimeline currentStatus={order.status} />

              {/* ── Items ── */}
              <div className="order-items-preview">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="order-item-img"
                    />
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                    <span className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Footer ── */}
              <div className="order-card-footer">
                <div className="order-footer-info">
                  <div className="order-info-block">
                    <span className="order-info-label">Total</span>
                    <span className="order-total">${order.totalPrice?.toFixed(2)}</span>
                  </div>

                  {order.shippingPrice === 0 ? (
                    <div className="order-info-block">
                      <span className="order-info-label">Shipping</span>
                      <span className="order-free-shipping">Free</span>
                    </div>
                  ) : (
                    <div className="order-info-block">
                      <span className="order-info-label">Shipping</span>
                      <span className="order-info-value">${order.shippingPrice?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="order-info-block">
                    <span className="order-info-label">Payment</span>
                    <span className={`order-payment-badge ${order.paymentMethod}`}>
                      {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    </span>
                  </div>

                  {addrLine && (
                    <div className="order-info-block">
                      <span className="order-info-label">Ship to</span>
                      <span className="order-info-value">{addrLine}</span>
                    </div>
                  )}

                  <div className="order-info-block">
                    <span className="order-info-label">Tracking #</span>
                    <span className="order-tracking-pill">
                      {order.orderNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="order-actions">
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button className="btn-order-track">Track Order</button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      className="btn-ghost danger"
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                    >
                      {cancellingId === order._id ? 'Cancelling…' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}