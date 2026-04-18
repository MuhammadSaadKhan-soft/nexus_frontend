import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import ProductGrid from '../components/product/ProductGrid';
import { useDebounce } from '../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'trending', label: 'Trending' },
];

const CATEGORIES = ['electronics', 'fashion', 'home', 'sports', 'beauty', 'books'];

export default function ShopPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);

  const debouncedPriceMin = useDebounce(priceMin, 500);
  const debouncedPriceMax = useDebounce(priceMax, 500);

  // Update sort if URL query changes
  useEffect(() => {
    const sortParam = searchParams.get('sort') || 'newest';
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [category, sort, debouncedPriceMin, debouncedPriceMax]);

  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (debouncedPriceMin) params.minPrice = debouncedPriceMin;
    if (debouncedPriceMax) params.maxPrice = debouncedPriceMax;

    const req = category
      ? productAPI.getByCategory(category, params)
      : productAPI.getAll(params);

    req
      .then(res => {
        console.log('API response:', res.data);
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch(err => {
        console.error('API error:', err);
        setProducts([]);
        setPagination({ page: 1, pages: 1, total: 0 });
      })
      .finally(() => setLoading(false));
  }, [category, sort, page, debouncedPriceMin, debouncedPriceMax]);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}</h1>
        {!loading && <p className="shop-count">{pagination?.total ?? 0} products</p>}
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <ul className="filter-list">
              <li>
                <Link to={`/shop?sort=${sort}`} className={!category ? 'active' : ''}>All</Link>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link
                    to={`/shop/${cat}?sort=${sort}`}
                    className={category === cat ? 'active' : ''}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min $"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                min="0"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max $"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </aside>

        {/* Product Area */}
        <div className="shop-main">
          <div className="shop-toolbar">
            <select
              className="sort-select"
              value={sort}
              onChange={e => {
                setSort(e.target.value);
                setSearchParams({ sort: e.target.value });
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="page-btn"
              >
                ← Prev
              </button>
              <span className="page-info">Page {page} of {pagination.pages}</span>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(p => p + 1)}
                className="page-btn"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}