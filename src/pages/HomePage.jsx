import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getFeatured(),
      productAPI.getAll({ sort: 'trending', limit: 8 }),
    ]).then(([featRes, trendRes]) => {
      setFeatured(featRes.data);
      setTrending(trendRes.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✦ AI-Powered Shopping</div>
          <h1 className="hero-title">
            Discover Products<br />
            <span className="hero-accent">Curated for You</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of e-commerce with intelligent recommendations,
            real-time inventory, and personalized deals.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary">Explore Shop</Link>
            <Link to="/shop/new" className="btn-ghost">New Arrivals →</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Rating</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">24/7</span><span className="stat-label">AI Support</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float card-1">
            <span className="float-icon">⬡</span>
            <p>AI found the perfect match</p>
          </div>
          <div className="hero-card-float card-2">
            <span className="float-icon green">✓</span>
            <p>Order shipped in real-time</p>
          </div>
          <div className="hero-orbit" />
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/shop" className="see-all-link">See all →</Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} className="category-card" style={{ '--cat-color': cat.color }}>
              <span className="cat-emoji">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2>✦ AI Featured Picks</h2>
          <Link to="/shop" className="see-all-link">View all</Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <p className="promo-tag">Limited Time</p>
          <h2>Up to 60% Off Electronics</h2>
          <p>Our AI has found the best deals. Don't miss out.</p>
          <Link to="/shop/electronics" className="btn-promo">Shop Deals</Link>
        </div>
        <div className="promo-decoration">
          <div className="promo-circle c1" />
          <div className="promo-circle c2" />
        </div>
      </section>

      {/* Trending */}
      <section className="products-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <Link to="/shop?sort=trending" className="see-all-link">View all</Link>
        </div>
        <ProductGrid products={trending} loading={loading} />
      </section>
    </div>
  );
}

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '⚡', color: '#6366f1', count: '12.4K' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#ec4899', count: '8.2K' },
  { name: 'Home & Living', slug: 'home', icon: '🏡', color: '#14b8a6', count: '5.7K' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#f59e0b', count: '3.9K' },
  { name: 'Beauty', slug: 'beauty', icon: '✨', color: '#a855f7', count: '7.1K' },
  { name: 'Books', slug: 'books', icon: '📚', color: '#10b981', count: '15K' },
];
