import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import { useAuth } from "./AuthContext"; // ✅ Use useAuth instead of AuthContext
import ProductGrid from "./ProductGrid";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, cart, removeFromCart } = useContext(CartContext);
  const { user } = useAuth(); // ✅ Get user state using useAuth()
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!user) {
    //   navigate("/login"); // ✅ Redirect unauthenticated users
    //   return;
    // }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/products");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [user, navigate]);

  return (
    <div className="App">
      <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
        🛒 <span className="cart-count">{cart.length}</span>
      </div>

      {cartOpen && (
        <div className="cart-dropdown">
          <h3>Cart Items</h3>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} - ${item.price}
                    <button onClick={() => removeFromCart(item.id)}>❌</button>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/checkout")} className="buy-now-btn">
                Buy Now
              </button>
            </>
          )}
        </div>
      )}

      <ProductGrid addToCart={addToCart} />
    </div>
  );
};

export default HomePage;
