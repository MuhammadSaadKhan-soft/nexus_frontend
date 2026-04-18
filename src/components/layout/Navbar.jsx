import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount, connected } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">NEXUS<span className="logo-accent">shop</span></span>
        </Link>

        {/* Nav Links */}
        <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/shop/electronics" className="nav-link">Electronics</Link>
          <Link to="/shop/fashion" className="nav-link">Fashion</Link>
          <Link to="/shop/home" className="nav-link">Home & Living</Link>
     {user?.role === "admin" && (
  <>
    <Link to="/admin" className="nav-link">Product Form</Link>
    
  </>
)}
           
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* AI Search */}
          <button className="nav-icon-btn ai-search-btn" onClick={() => setShowSearch(!showSearch)} title="AI Search">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="ai-badge">AI</span>
          </button>

          {/* Notifications */}
          <div className="notif-wrapper" ref={notifRef}>
            <button className="nav-icon-btn" onClick={() => setShowNotifs(!showNotifs)} title="Notifications">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && <span className="badge badge-red">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              <span className={`ws-dot ${connected ? 'connected' : 'disconnected'}`} title={connected ? 'Live' : 'Offline'} />
            </button>
            {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
          </div>

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn cart-btn" title="Cart">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && <span className="badge badge-accent">{itemCount}</span>}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="user-menu-wrapper">
              <button className="user-avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="avatar-initials">{user.name?.charAt(0).toUpperCase()}</div>
                )}
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Profile</Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Orders</Link>
                  <button className="dropdown-item logout" onClick={() => { logout(); setShowUserMenu(false); }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn">Sign In</Link>
          )}

          {/* Mobile Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* AI Search Bar */}
      {showSearch && (
        <div className="search-overlay">
          <form onSubmit={handleSearch} className="search-form">
            <span className="search-ai-label">✦ AI</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search with AI — describe what you're looking for..."
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-submit">Search</button>
            <button type="button" className="search-close" onClick={() => setShowSearch(false)}>✕</button>
          </form>
        </div>
      )}
    </header>
  );
}
