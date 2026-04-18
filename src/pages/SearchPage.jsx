import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../api';
import ProductGrid from '../components/product/ProductGrid';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 400);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) return;
    setLoading(true);
    productAPI.search(debouncedQuery)
      .then(res => setProducts(res.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="search-page">
      <h1 className="page-title">Search results for <em>"{query}"</em></h1>
      <ProductGrid products={products} loading={loading} emptyMessage="No products match your search." />
    </div>
  );
}