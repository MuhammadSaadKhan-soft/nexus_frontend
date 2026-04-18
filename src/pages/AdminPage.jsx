import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { adminAPI } from '../api';
import AdminProductTable from '../components/admin/AdminProductTable';
import AdminProductForm from '../components/admin/AdminProductForm';

export default function AdminPage() {
  const { user } = useAuth();
  const { pushToast } = useNotifications();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Guard: redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/', { replace: true });
  }, [user, navigate]);

  // Load stats
  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(() => {});
  }, [refreshKey]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    setFormLoading(true);
    try {
      if (editProduct) {
        await adminAPI.updateProduct(editProduct._id, data);
        pushToast('Product updated!', 'success');
      } else {
        await adminAPI.createProduct(data);
        pushToast('Product created!', 'success');
      }
      setShowForm(false);
      setEditProduct(null);
      setRefreshKey(k => k + 1);
    } catch (err) {
      pushToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="route-loading"><div className="spinner" /></div>;
  }

  const StatCard = ({ label, value, icon, accent }) => (
    <div className="admin-stat-card" style={{ '--accent': accent }}>
      <div className="admin-stat-icon">{icon}</div>
      <div>
        <p className="admin-stat-value">{value ?? '—'}</p>
        <p className="admin-stat-label">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back, {user.name}</p>
        </div>
        <button className="admin-add-btn" onClick={handleAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats-grid">
          <StatCard label="Total Products" value={stats.stats.totalProducts} icon="📦" accent="var(--c-accent)" />
          <StatCard label="Active" value={stats.stats.activeProducts} icon="✅" accent="var(--c-green)" />
          <StatCard label="Out of Stock" value={stats.stats.outOfStock} icon="⚠️" accent="var(--c-red)" />
          <StatCard label="Users" value={stats.stats.totalUsers} icon="👥" accent="var(--c-accent-2)" />
          <StatCard label="Orders" value={stats.stats.totalOrders} icon="🛒" accent="var(--c-amber)" />
        </div>
      )}

      {/* Recent Products preview */}
      {stats?.recentProducts?.length > 0 && (
        <div className="admin-recent">
          <h2 className="admin-section-title">Recently Added</h2>
          <div className="admin-recent-list">
            {stats.recentProducts.map(p => (
              <div key={p._id} className="admin-recent-item" onClick={() => handleEdit(p)}>
                <img
                  src={p.images?.[0] || '/placeholder-product.jpg'}
                  alt={p.name}
                  className="admin-recent-img"
                  onError={e => { e.target.src = '/placeholder-product.jpg'; }}
                />
                <div className="admin-recent-info">
                  <p className="admin-recent-name">{p.name}</p>
                  <p className="admin-recent-meta">{p.category} · ${p.price?.toFixed(2)}</p>
                </div>
                <span className={`admin-recent-stock ${p.stock === 0 ? 'out' : ''}`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-table-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">All Products</h2>
        </div>
        <AdminProductTable onEdit={handleEdit} refreshKey={refreshKey} />
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AdminProductForm
          product={editProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
