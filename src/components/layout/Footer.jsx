import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">NEXUS<span className="logo-accent">shop</span></span>
          </Link>
          <p className="footer-tagline">AI-powered shopping for the modern world.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop/electronics">Electronics</Link>
            <Link to="/shop/fashion">Fashion</Link>
            <Link to="/shop/home">Home & Living</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/profile">Profile</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NexusShop. All rights reserved.</p>
      </div>
    </footer>
  );
}