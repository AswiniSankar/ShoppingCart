import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="header">
      <h1 onClick={() => navigate("/")}>Shopping Cart</h1>
      {user ? (
        <div className="user-info">
          {/* ✅ Show name, hover to see email */}
          <span className="user-name" title={user.email}>
            Welcome, {user.name}
          </span>

          {/* ✅ Added Order History Button */}
          <button onClick={() => navigate("/order-history")} className="history-btn">
            Order History
          </button>

          {/* ✅ Fixed Duplicate Logout Button */}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <div className="action-button">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default Header;
