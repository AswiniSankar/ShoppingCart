import React from "react";
import "./Footer.css"; // ✅ Import footer styles

const Footer = () => {
  const currentYear = new Date().getFullYear(); // ✅ Get current year dynamically

  return (
    <footer className="footer">
      <p>© {currentYear} Shopping Cart. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
