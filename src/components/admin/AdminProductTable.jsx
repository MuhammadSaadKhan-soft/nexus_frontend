import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';
import { useNotifications } from '../../context/NotificationContext';

export default function AdminProductTable({ onEdit, refreshKey }) {
  const { pushToast } = useNotifications();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProducts({ page, search, category, status, limit: 15 });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch {
      pushToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, refreshKey]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [search, category, status]);

  const handleToggle = async (product) => {
    setToggling(product._id);
    try {
      await adminAPI.toggleProduct(product._id);
      pushToast(`Product ${product.isActive ? 'deactivated' : 'activated'}`, 'success');
      load();
    } catch {
      pushToast('Toggle failed', 'error');
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product._id);
    try {
      await adminAPI.deleteProduct(product._id);
      pushToast('Product deleted', 'info');
      load();
    } catch {
      pushToast('Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="apt-wrapper">
      {/* Toolbar */}
      <div className="apt-toolbar">
        <div className="apt-search-wrap">
          <svg className="apt-search-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="apt-search"
            placeholder="Search by name, SKU, brand…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="apt-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="apt-filters">
          <select className="apt-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {['electronics','fashion','home','beauty','sports','books','toys','automotive','food','other']
              .map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select className="apt-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <span className="apt-count">{pagination.total} products</span>
      </div>

      {/* Table */}
      <div className="apt-table-wrap">
        <table className="apt-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="apt-empty">
                <span className="apt-spinner" />
              </td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="apt-empty">No products found</td></tr>
            ) : products.map(product => (
              <tr key={product._id} className={!product.isActive ? 'apt-row-inactive' : ''}>
                {/* Product */}
                <td className="apt-td-product">
                  <div className="apt-product-cell">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="apt-thumb"
                      onError={e => { e.target.src = '/placeholder-product.jpg'; }}
                    />
                    <div>
                      <p className="apt-name">{product.name}</p>
                      {product.brand && <p className="apt-brand">{product.brand}</p>}
                      {product.sku && <p className="apt-sku">SKU: {product.sku}</p>}
                    </div>
                  </div>
                </td>
                {/* Category */}
                <td><span className="apt-category">{product.category}</span></td>
                {/* Price */}
                <td className="apt-price">
                  <span className="apt-price-main">${product.price?.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="apt-price-orig">${product.originalPrice?.toFixed(2)}</span>
                  )}
                </td>
                {/* Stock */}
                <td>
                  <span className={`apt-stock ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                {/* Status */}
                <td>
                  <div className="apt-status-wrap">
                    <button
                      className={`apt-toggle ${product.isActive ? 'on' : 'off'}`}
                      onClick={() => handleToggle(product)}
                      disabled={toggling === product._id}
                      title={product.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <span className="apt-toggle-thumb" />
                    </button>
                    <span className={`apt-status-label ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                {/* Actions */}
                <td>
                  <div className="apt-actions">
                    <button
                      className="apt-btn-edit"
                      onClick={() => onEdit(product)}
                      title="Edit"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="apt-btn-delete"
                      onClick={() => handleDelete(product)}
                      disabled={deleting === product._id}
                      title="Delete"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="apt-pagination">
          <button className="apt-page-btn" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
            ← Prev
          </button>
          <span className="apt-page-info">Page {page} of {pagination.pages}</span>
          <button className="apt-page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
