import { useState, useEffect } from 'react';
import { productAPI } from '../api';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(e => setError(e.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}