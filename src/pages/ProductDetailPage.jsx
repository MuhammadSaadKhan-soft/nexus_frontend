import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useWishlist } from '../hooks/useWishlist';
import ProductGrid from '../components/product/ProductGrid';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { pushToast } = useNotifications();
  const { isWishlisted, toggle } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      productAPI.getRelated(id),
      productAPI.getReviews(id),
    ])
      .then(([prodRes, relRes, revRes]) => {
        setProduct(prodRes.data);
        setRelated(relRes.data.products || []);
        setReviews(revRes.data.reviews || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      pushToast(`${product.name} added to cart!`, 'success');
    } catch {
      pushToast('Failed to add to cart', 'error');
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  const handleSubmitReview = async e => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, reviewForm);
      pushToast('Review submitted!', 'success');
      const revRes = await productAPI.getReviews(id);
      setReviews(revRes.data.reviews || []);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      pushToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!product) return <div className="not-found-msg">Product not found.</div>;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{' '}
        <Link to={`/shop/${product.category}`}>{product.category}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="product-detail-main">
        {/* Images */}
        <div className="product-images">
          <div className="main-image-wrapper">
            <img
              src={product.images?.[activeImg] || '/placeholder-product.jpg'}
              alt={product.name}
              className="main-image"
            />
            {discount && <span className="badge-discount large">-{discount}%</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="image-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`star ${s <= Math.round(product.rating || 0) ? 'filled' : ''}`}>★</span>
            ))}
            <span className="rating-count">({reviews.length} reviews)</span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="detail-original">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          {product.stock > 0 ? (
            <p className="stock-status in-stock">✓ In Stock{product.stock < 10 ? ` — only ${product.stock} left` : ''}</p>
          ) : (
            <p className="stock-status out-stock">✕ Out of Stock</p>
          )}

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="quantity-row">
              <label>Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="detail-actions">
            <button
              className={`btn-primary add-cart-btn ${adding ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              {product.stock === 0 ? 'Out of Stock' : adding ? '✓ Added!' : 'Add to Cart'}
            </button>
            <button
              className={`wishlist-btn-lg ${wishlisted ? 'active' : ''}`}
              onClick={() => toggle(product._id)}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg width="20" height="20" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="product-tags">
              {product.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="tab-nav">
          {['description', 'reviews'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && ` (${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <p>{product.description || 'No description available.'}</p>
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <table className="spec-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <tr key={k}>
                        <td className="spec-key">{k}</td>
                        <td className="spec-val">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{r.user?.name || 'Anonymous'}</span>
                        <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <form className="review-form" onSubmit={handleSubmitReview}>
                <h4>Write a Review</h4>
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))}
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    placeholder="Share your thoughts..."
                    rows={4}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-header">
            <h2>Related Products</h2>
          </div>
          <ProductGrid products={related} loading={false} />
        </section>
      )}
    </div>
  );
}