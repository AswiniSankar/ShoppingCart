import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./ThankYou.css";


const ThankYou = () => {
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedOrder = localStorage.getItem("lastOrder");
        
        if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            setOrderData(parsedOrder);
    
            // Retrieve existing order history
            const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    
            // Add new order to history if it doesn't exist
            const updatedHistory = [...orderHistory, parsedOrder];
            localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));
        }
    }, []);
    
    if (!orderData) return <h2>Loading order details...</h2>;

const generateInvoice = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    doc.text("Order Invoice", 20, 10);
    doc.text(`Transaction ID: ${orderData.invoiceNumber}`, 20, 20);
    console.log("Loaded from ThankYou page order data:", orderData); 
    if (orderData.cart) {
        autoTable(doc, {
            head: [["Product", "Quantity", "Price"]],
            body: orderData.cart.map((item) => [
                item.name,
                item.quantity,
                `$${item.price?.toFixed(2) || "0.00"}`,
            ]),
        });
    }

    doc.text(
        `Total Amount: $${(orderData.amount || 0).toFixed(2)}`,
        20,
        doc.lastAutoTable.finalY + 10
    );
    const fileName = `${orderData.invoiceNumber || "Unknown"}.pdf`;
    doc.save(fileName);
    localStorage.removeItem("cart");
};

    
    
    return (
        <div className="thank-you-container-main">
            <div className="thank-you-container">
            <h1>Thank You for Your Purchase!</h1>
            <img src="https://i.gifer.com/7efs.gif" alt="success" className="gif-image" />
            <p className="payment-success">Your payment was successful.</p>
            <div className="order-info-main">
            <div className="order-info">
                <p><strong>Order Number:</strong> 
                   <span className="order-link" onClick={() => navigate(`/order-details/${orderData.orderNumber}`)}>
                       {orderData.orderNumber}
                   </span>
                </p>
                <p><strong>Invoice Number:</strong> 
                   <span className="invoice-link" onClick={generateInvoice}>
                       {orderData.invoiceNumber}
                   </span>
                </p>
            </div>
            <button onClick={() => navigate("/")}>Back to Catalog</button>
            </div>
           
        </div>
        </div>
        
    );
};

export default ThankYou;
