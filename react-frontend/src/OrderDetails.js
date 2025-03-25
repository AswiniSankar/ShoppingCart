import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetails = () => {
    const { orderNumber } = useParams();
    const [orderData, setOrderData] = useState(null);
    console.log("order Data:" , orderData);
    const navigate = useNavigate();

    useEffect(() => {
        const storedOrder = localStorage.getItem("lastOrder");
        if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            if (parsedOrder.orderNumber === orderNumber) {
                setOrderData(parsedOrder);
            }
        }
    }, [orderNumber]);

    if (!orderData) return <h2>Loading order details...</h2>;

    const generateInvoice = () => {
        const doc = new jsPDF();
        doc.text("Order Invoice", 20, 10);
        doc.text(`Transaction ID: ${orderData.invoiceNumber}`, 20, 20);
    
        autoTable(doc, {
            head: [["Product", "Quantity", "Price"]],
            body: orderData.cart.map((item) => [
                item.name, 
                item.quantity, 
                `$${item.price?.toFixed(2) || "0.00"}`
            ]),
        });
    
        doc.text(`Total Amount: $${(orderData.totalPrice || 0).toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);
        const fileName = `${orderData.invoiceNumber || "Unknown"}.pdf`;
        doc.save(fileName);
        localStorage.removeItem("cart");
    };
    
    return (
        <div className="order-details-container">
            <h1>Order Details</h1>
            <div className="order-summary">
                <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
                            {/* Click Invoice Number to download PDF */}
            <p>
                <strong>Invoice Number:</strong> 
                <span className="invoice-link" onClick={generateInvoice} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                    {orderData.invoiceNumber}
                </span>
            </p>
            </div>

            <div className="cart-items">
                <h2>Items Purchased</h2>
                {orderData.cart?.map((item, index) => (
                    <div key={index} className="cart-item">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>Price: ${item.price ? item.price.toFixed(2) : "0.00"}</span>
                    </div>
                ))}
            </div>

            <p className="total-price">
                <strong>Total Amount:</strong> ${orderData.amount ? orderData.amount.toFixed(2) : "0.00"}
            </p>

            <button className="back-button" onClick={() => navigate("/")}>Back to Catalog</button>
        </div>
    );
};

export default OrderDetails;
