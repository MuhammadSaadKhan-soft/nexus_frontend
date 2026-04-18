import { useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      wishlistAPI.get().then(res => setWishlist(res.data.items)).catch(console.error);
    }
  }, [user]);

  const isWishlisted = useCallback((productId) =>
    wishlist.some(item => item.product._id === productId), [wishlist]);

  const toggle = useCallback(async (productId) => {
    if (isWishlisted(productId)) {
      await wishlistAPI.remove(productId);
      setWishlist(prev => prev.filter(i => i.product._id !== productId));
    } else {
      const res = await wishlistAPI.add(productId);
      setWishlist(res.data.items);
    }
  }, [isWishlisted]);

  return { wishlist, isWishlisted, toggle };
}
