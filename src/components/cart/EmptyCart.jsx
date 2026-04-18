import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-text">
        Looks like you haven't added anything yet. Browse our collection and find something you'll love.
      </p>
      <Link to="/shop" className="empty-cart-btn btn-primary">
        Start Shopping
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}