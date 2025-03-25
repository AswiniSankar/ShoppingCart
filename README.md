# 🛍️ Shopping Cart
- Build a Shopping Cart using Flask and React

## ✨ Key Features  

### ✅ 1. Order Persistence in Local Storage  
- After a successful purchase, the order details are stored in `localStorage` under `lastOrder`.  
- The order history is also updated and stored under `orderHistory`.  
- Ensures users can revisit their past orders even after refreshing the page.  

### 📜 2. Invoice Generation (PDF)  
- A **Downloadable Invoice** feature using `jsPDF` and `autoTable`.  
- Clicking the **Invoice Number** generates a **PDF invoice** containing:  
  - **Transaction ID**  
  - **Ordered Items** (Name, Quantity, Price)  
  - **Total Amount**  
- The invoice is automatically saved and named using the **Invoice Number**.  
- **Cart data is cleared** after invoice generation to prevent duplicate records.  

### 🔄 3. Improved Navigation  
- Clicking on the **Order Number** redirects to `/order-details/:orderNumber` using `useNavigate`.  
- A **"Back to Catalog"** button allows users to return to the product page easily.  

---

## 🛠️ Tech Stack  
- **React**  
- **React Router (`useNavigate`)** for seamless page transitions  
- **localStorage** for order data persistence  
- **jsPDF + autoTable** for invoice generation  
- **CSS Flexbox** for UI alignment  

---

## 🚀 How to Use  
1. **Complete a purchase** → Redirects to **Thank You Page**  
2. **Click Invoice Number** → Generates **PDF Invoice**  
3. **Click Order Number** → Redirects to **Order Details**  
4. **Click Back to Catalog** → Returns to the **Product List**  
