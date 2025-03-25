import React from "react";
import { useCart } from "./CartContext";
import "./Catalog.css";

const Catalog = ({ products }) => {
    const { cart, addToCart } = useCart();

    // ✅ Calculate total quantity & total price
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <div className="catalog-container">
            <h2>Product Catalog</h2>

            {/* ✅ Show Total Quantity & Price */}
            <div className="cart-summary">
                <p><strong>Total Items:</strong> {totalQuantity}</p>
                <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
            </div>

            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image_url} alt={product.name} className="product-image" />
                        <h4>{product.name}</h4>
                        <p>${product.price.toFixed(2)}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
