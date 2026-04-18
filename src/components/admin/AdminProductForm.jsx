import React, { useState, useEffect } from 'react';

const CATEGORIES = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive', 'food', 'other'];
const SHIPPING = ['standard', 'express', 'free'];

const empty = {
  name: '', description: '', shortDescription: '', price: '', originalPrice: '',
  category: '', subCategory: '', brand: '', stock: '', sku: '',
  tags: '', images: '', shippingClass: 'standard', weight: '',
  isFeatured: false, isNew: false, aiRecommended: false, isActive: true,
};

export default function AdminProductForm({ product, onSave, onCancel, loading }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        brand: product.brand || '',
        stock: product.stock ?? '',
        sku: product.sku || '',
        tags: (product.tags || []).join(', '),
        images: (product.images || []).join('\n'),
        shippingClass: product.shippingClass || 'standard',
        weight: product.weight ?? '',
        isFeatured: !!product.isFeatured,
        isNew: !!product.isNew,
        aiRecommended: !!product.aiRecommended,
        isActive: product.isActive !== false,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [product]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Category is required';
    if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) e.stock = 'Valid stock number required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice !== '' ? Number(form.originalPrice) : undefined,
      stock: form.stock !== '' ? Number(form.stock) : 0,
      weight: form.weight !== '' ? Number(form.weight) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: form.images ? form.images.split('\n').map(i => i.trim()).filter(Boolean) : [],
    };
    onSave(payload);
  };

  return (
    <div className="apf-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="apf-modal">
        {/* Header */}
        <div className="apf-header">
          <div>
            <h2 className="apf-title">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="apf-subtitle">{product ? `Editing: ${product.name}` : 'Fill in the details below'}</p>
          </div>
          <button className="apf-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <form className="apf-form" onSubmit={handleSubmit} noValidate>
          {/* 2-col grid */}
          <div className="apf-grid">
            <div>
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" className="apf-input" />
              {errors.name && <p className="apf-error">{errors.name}</p>}
            </div>

            <div>
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Sony" className="apf-input" />
            </div>

            <div>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="apf-input apf-select">
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              {errors.category && <p className="apf-error">{errors.category}</p>}
            </div>

            <div>
              <label>Sub-category</label>
              <input name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="e.g. Over-ear" className="apf-input" />
            </div>

            <div>
              <label>Price ($) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" className="apf-input" />
              {errors.price && <p className="apf-error">{errors.price}</p>}
            </div>

            <div>
              <label>Original Price ($)</label>
              <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="Leave blank if no discount" className="apf-input" />
            </div>

            <div>
              <label>Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" className="apf-input" />
              {errors.stock && <p className="apf-error">{errors.stock}</p>}
            </div>

            <div>
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="Optional unique code" className="apf-input" />
            </div>

            <div>
              <label>Shipping Class</label>
              <select name="shippingClass" value={form.shippingClass} onChange={handleChange} className="apf-input apf-select">
                {SHIPPING.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label>Weight (kg)</label>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Optional" className="apf-input" />
            </div>
          </div>

          <div>
            <label>Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} placeholder="One-line summary shown on cards" className="apf-input apf-textarea apf-textarea--sm" />
          </div>

          <div>
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Full product description" className="apf-input apf-textarea" />
            {errors.description && <p className="apf-error">{errors.description}</p>}
          </div>

          <div>
            <label>Image URLs</label>
            <textarea name="images" value={form.images} onChange={handleChange} rows={3} placeholder="Paste one image URL per line" className="apf-input apf-textarea apf-textarea--sm" />
          </div>

          <div>
            <label>Tags</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Comma-separated tags" className="apf-input" />
          </div>

          {/* Flags */}
          <div className="apf-flags">
            {[
              { name: 'isActive', label: 'Active (visible in store)' },
              { name: 'isFeatured', label: 'Featured' },
              { name: 'isNew', label: 'Mark as New' },
              { name: 'aiRecommended', label: '✦ AI Recommended' },
            ].map(f => (
              <label key={f.name} className="apf-checkbox">
                <input type="checkbox" name={f.name} checked={form[f.name]} onChange={handleChange} />
                <span className="apf-checkbox-mark" />
                <span>{f.label}</span>
              </label>
            ))}
          </div>

          {/* Preview first image */}
          {form.images.trim() && (
            <div className="apf-preview">
              <p className="apf-label">Image Preview</p>
              <img src={form.images.split('\n')[0].trim()} alt="preview" className="apf-preview-img" onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          {/* Actions */}
          <div className="apf-actions">
            <button type="button" onClick={onCancel} disabled={loading} className="apf-btn-cancel">Cancel</button>
            <button type="submit" disabled={loading} className="apf-btn-save">{loading ? 'Saving...' : (product ? 'Save Changes' : 'Create Product')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}