import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <h1 className="page-title">My Wishlist</h1>
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to your wishlist.</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="page-title">My Wishlist <span className="cart-count">{wishlist.length} items</span></h1>
      <div className="product-grid">
        {wishlist.map(item => (
          <ProductCard key={item.product._id} product={item.product} />
        ))}
      </div>
    </div>
  );
}