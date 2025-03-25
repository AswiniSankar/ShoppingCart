import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import "./Checkout.css";

const Checkout = () => {
    return <CheckoutForm />;
};

const CheckoutForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, updateQuantity, removeFromCart, totalQuantity, totalPrice } = useCart();
    const [isProcessing, setProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    useEffect(() => {
        if (user) {
            navigate("/checkout");
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
    
        try {
            if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
                throw new Error("Missing card details");
            }
    
            const orderNumber = `ORD-${Date.now()}`;
            const invoiceNumber = `INV-${Date.now()}`;
    
            // Simulate Payment Processing (2-second delay)
            await new Promise((resolve) => setTimeout(resolve, 2000));
    
            // ✅ Store Order & Invoice Data for Thank You Page
            localStorage.setItem("lastOrder", JSON.stringify({
                orderNumber,
                invoiceNumber,
                subscriberId: user?.id || "Guest",
                amount: totalPrice,
                currency: "USD",
                status: "Success",
                cart: cart?.length ? cart : [], // ✅ Ensure cart is stored properly
            }));
            localStorage.removeItem("cart");
            
    
            // ✅ Redirect to Thank You Page
            navigate("/ThankYou");
    
        } catch (error) {
            console.error("Payment processing error:", error);
            alert(`Payment failed: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    // const handlePaymentSuccess = (transactionId) => {
    //     const orderDetails = {
    //         orderNumber: `ORD-${Date.now()}`,
    //         invoiceNumber: `INV-${Date.now()}`,
    //         cart: cart, // Ensure cart items are stored
    //         totalPrice: totalPrice, // Ensure total price is stored
    //     };
    
    //     localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
    
    //     navigate("/ThankYou");
    // };
    
    
    // const generateInvoice = (transactionId) => {
    //     const doc = new jsPDF();
    
    //     doc.text("Order Invoice", 20, 10);
    //     doc.text(`Transaction ID: ${transactionId}`, 20, 20);
        
    //     autoTable(doc, {
    //         head: [["Product", "Quantity", "Price"]],
    //         body: cart.map((item) => [item.name, item.quantity, `$${item.price.toFixed(2)}`]),
    //     });
    
    //     doc.text(`Total Amount: $${totalPrice.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);
    //     doc.save("invoice.pdf");
    // };
    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <button className="back-button" onClick={() => navigate("/")}>Back to Catalog</button>
    
            {cart.length === 0 ? (
                <p>
                Your cart is empty. Please add items before proceeding to checkout.  
                <img 
                    src="https://img.icons8.com/?size=100&id=Kjfzx1jRs9Jh&format=png&color=000000" 
                    alt="Empty Cart"
                    width="50" 
                    height="50" 
                />
            </p>
            
            ) : (
                <>
                    {/* ✅ Order Summary Section */}
                    <div className="order-summary">
                        <h3 className="summary-line">Order Summary</h3>
                        <div className="order-grid">
                            {cart.map((item) => (
                               
                                <div key={item.id} className="order-item">
                                    <img src={item.image_url} alt={item.name} className="checkout-image" />
                                    <p className="product-name">{item.name}</p>
                                    <p className="product-price">${item.price.toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                                            {/* ✅ Total Quantity & Total Price */}
                    <div className="order-summary-totals">
                        <h3>Total Items: {totalQuantity}</h3>
                        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    </div>
                    </div>
    
                {/* ✅ Centered Payment Form */}
<div className="card-form-container">
    <h3>Enter Card Details</h3>
    {/* ✅ Wrap the form and attach handleSubmit to onSubmit */}
    <form onSubmit={handleSubmit}>
        <div className="card-inputs">
            <label>Card Number:</label>
            <input 
                type="text" 
                name="cardNumber" 
                value={cardDetails.cardNumber} 
                onChange={handleInputChange} 
                maxLength="16" 
                required 
            />

            <label>Expiry (MM/YY):</label>
            <input 
                type="text" 
                name="expiry" 
                value={cardDetails.expiry} 
                onChange={handleInputChange} 
                placeholder="MM/YY" 
                required 
            />

            <label>CVV:</label>
            <input 
                type="text" 
                name="cvv" 
                value={cardDetails.cvv} 
                onChange={handleInputChange} 
                maxLength="3" 
                required 
            />
        </div>

        {/* ✅ Ensure button type is submit so it triggers form submission */}
        <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
        </button>
    </form>
</div>


                </>
            )}
        </div>
    );
    
};

export default Checkout;