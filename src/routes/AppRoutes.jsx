import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import OrdersPage from "../pages/OrdersPage";
import WishlistPage from "../pages/WishlistPage";
import SearchPage from "../pages/SearchPage";
import AdminPage from "../pages/AdminPage";
import NotFoundPage from "../pages/NotFoundPage";

import PrivateRoute from "./PrivateRoute";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminProductTable from "../components/admin/AdminProductTable";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:category" element={<ShopPage />} />

      <Route path="/product/:id" element={<ProductDetailPage />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/search" element={<SearchPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute adminOnly={true}>
            <OrdersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <WishlistPage />
          </PrivateRoute>
        }
      />

     <Route
  path="/admin"
  element={
    <PrivateRoute >
      <AdminPage />
    </PrivateRoute>
  }
/>
    <Route
  path="/adminProductForm"
  element={
    <PrivateRoute adminOnly={true}>
      <AdminProductForm />
    </PrivateRoute>
  }
/>    <Route
  path="/adminProductTable"
  element={
    <PrivateRoute adminOnly={true}>
      <AdminProductTable />
    </PrivateRoute>
  }
/>


      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}