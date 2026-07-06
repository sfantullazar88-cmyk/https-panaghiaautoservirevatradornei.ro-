import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import { messaging, getToken, onMessage } from "./firebase";
import { HelmetProvider } from "react-helmet-async";

// Legal pages imports
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsConditions from "./pages/legal/TermsConditions";
import CookiePolicy from "./pages/legal/CookiePolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import GDPRConsent from "./pages/legal/GDPRConsent";

// Admin imports
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminTeam from './pages/admin/AdminTeam';
import AdminDelivery from "./pages/admin/AdminDelivery";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A847]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Public Layout (with Header/Footer)
const PublicLayout = ({ children, cartItemCount }) => (
  <>
    <Header cartItemCount={cartItemCount} />
    <main>{children}</main>
    <Footer />
    <CookieConsent />
  </>
);

function AppContent() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
  const setupNotifications = async () => {
    try {
      if (!("Notification" in window)) return;

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const firebaseToken = await getToken(messaging, {
          vapidKey: "BMHdpsOq08rGsDDXYAff9WLC1hcJSUCn3Lj5l3nWjl-7c0wXLk-VuNrZIBAEGpDQHPjw6ABaFQqkoN4dAJ-ry6k"
        });

        console.log("Firebase notification token:", firebaseToken);

        await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/notifications/register-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: firebaseToken,
              device_name: "Motorola Edge 40"
            })
          }
        );
      }

      onMessage(messaging, (payload) => {
        alert(payload?.notification?.title || "Comandă nouă!");
      });
    } catch (error) {
      console.error("Eroare notificări:", error);
    }
  };

  setupNotifications();
}, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateCart = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/meniu"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Menu onAddToCart={addToCart} />
            </PublicLayout>
          }
        />
        <Route
          path="/echipa"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Team />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/comanda"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Order
                cart={cart}
                onUpdateCart={updateCart}
                onRemoveFromCart={removeFromCart}
                onClearCart={clearCart}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/comanda/success"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <Order
                cart={[]}
                onUpdateCart={updateCart}
                onRemoveFromCart={removeFromCart}
                onClearCart={clearCart}
              />
            </PublicLayout>
          }
        />

        {/* Legal Routes */}
        <Route
          path="/confidentialitate"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <PrivacyPolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/termeni-conditii"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <TermsConditions />
            </PublicLayout>
          }
        />
        <Route
          path="/cookie"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <CookiePolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/anulare-rambursare"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <RefundPolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/gdpr"
          element={
            <PublicLayout cartItemCount={cartItemCount}>
              <GDPRConsent />
            </PublicLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="delivery" element={<AdminDelivery />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />

        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
