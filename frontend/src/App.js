import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Order from "./pages/Order";

function App() {
  const [cart, setCart] = useState([]);

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
      <BrowserRouter>
        <Header cartItemCount={cartItemCount} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meniu" element={<Menu onAddToCart={addToCart} />} />
            <Route path="/echipa" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/comanda"
              element={
                <Order
                  cart={cart}
                  onUpdateCart={updateCart}
                  onRemoveFromCart={removeFromCart}
                  onClearCart={clearCart}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </BrowserRouter>
    </div>
  );
}

export default App;