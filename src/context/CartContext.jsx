import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload.items, total: action.payload.total, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR':
      return { ...state, items: [], total: 0, coupon: null };
    case 'SET_COUPON':
      return { ...state, coupon: action.payload };
    default:
      return state;
  }
};

const initialState = { items: [], total: 0, coupon: null, loading: false, error: null };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else dispatch({ type: 'CLEAR' });
  }, [user]);

  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const addToCart = async (productId, quantity = 1, variant = null) => {
    const res = await cartAPI.addItem({ productId, quantity, variant });
    dispatch({ type: 'SET_CART', payload: res.data });
    return res.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartAPI.updateItem(itemId, { quantity });
    dispatch({ type: 'SET_CART', payload: res.data });
  };

  const removeFromCart = async (itemId) => {
    const res = await cartAPI.removeItem(itemId);
    dispatch({ type: 'SET_CART', payload: res.data });
  };

  const clearCart = async () => {
    await cartAPI.clear();
    dispatch({ type: 'CLEAR' });
  };

  const applyCoupon = async (code) => {
    const res = await cartAPI.applyCoupon(code);
    dispatch({ type: 'SET_COUPON', payload: res.data.coupon });
    dispatch({ type: 'SET_CART', payload: res.data.cart });
    return res.data;
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state, itemCount, fetchCart,
      addToCart, updateQuantity, removeFromCart, clearCart, applyCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
