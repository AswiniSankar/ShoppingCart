import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthContext";
import HomePage from "./HomePage";
import CheckoutPage from "./Checkout";
import Login from "./Login";
import SignUp from "./Signup";
import Header from "./Header";
import Footer from "./Footer";
import "./App.css";
import ThankYou from "./ThankYou";
import OrderDetails from "./OrderDetails";
import OrderHistory from "./OrderHistory";

// ✅ Use Flexbox to push the footer to the bottom
const WrappedApp = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/ThankYou" element={<ThankYou />} />
              <Route path="/order-details/:orderNumber" element={<OrderDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default WrappedApp;
