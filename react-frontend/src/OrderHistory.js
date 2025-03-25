import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import sampleImage from "../src/assets/icons8-empty-48.png"

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let storedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];

        // ✅ Filter unique orders based on `orderNumber` and `invoiceNumber`
        const uniqueOrders = storedOrders.reduce((acc, current) => {
            if (!acc.some(order => order.orderNumber === current.orderNumber && order.invoiceNumber === current.invoiceNumber)) {
                acc.push(current);
            }
            return acc;
        }, []);

        // ✅ Ensure only unique orders are stored in localStorage
        localStorage.setItem("orderHistory", JSON.stringify(uniqueOrders));
        setOrders(uniqueOrders);
    }, []);

    const generateInvoice = (order) => {
        const doc = new jsPDF();
        doc.text("Order Invoice", 20, 10);
        doc.text(`Transaction ID: ${order.invoiceNumber}`, 20, 20);

        if (order.cart && order.cart.length > 0) {
            autoTable(doc, {
                head: [["Product", "Quantity", "Price"]],
                body: order.cart.map((item) => [
                    item.name,
                    item.quantity,
                    `$${item.price?.toFixed(2) || "0.00"}`,
                ]),
            });
        }

        doc.text(
            `Total Amount: $${(order.amount || 0).toFixed(2)}`,
            20,
            doc.lastAutoTable.finalY + 10
        );

        const fileName = `${order.invoiceNumber || "Unknown"}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="order-history-container">
            <h1>Your Order History</h1>
            {orders.length === 0 ? (
                <p>No previous orders found.
                                    <img 
                    src={sampleImage}
                    alt="Empty Cart"
                    width="20px" 
                    height="20px" 
                />
                </p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Invoice Number</th>
                            <th>Total Amount</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={`${order.orderNumber}-${order.invoiceNumber}`}> 
                                <td>
                                    <span className="order-link" onClick={() => navigate(`/order-details/${order.orderNumber}`)}>
                                        {order.orderNumber}
                                    </span>
                                </td>
                                <td>{order.invoiceNumber}</td>
                                <td>${order.amount?.toFixed(2) || "0.00"}</td>
                                <td>
                                    <button onClick={() => generateInvoice(order)}>Download Invoice</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={() => navigate("/")}>Back to Catalog</button>
        </div>
    );
};

export default OrderHistory;
