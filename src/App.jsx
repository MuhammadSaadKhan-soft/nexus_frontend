import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationToast from './components/notifications/NotificationToast';
import AIAssistant from './components/ai/AIAssistant';
import './styles/globals.css';

export default function App() {
  return (

      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <div className="app-wrapper">
                <Navbar />
                <main className="main-content">
                  <AppRoutes />
                </main>
                 <Footer />
                <NotificationToast />
                <AIAssistant />
              </div>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
       </ThemeProvider> 
  
  );
}
