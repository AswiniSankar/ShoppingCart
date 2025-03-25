import React, { useState, useEffect } from 'react';
import './ProductGrid.css';

const ProductGrid = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Set number of products per page

  // Fetch products from API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page function
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div>
      {/* Product Grid */}
      <div className="product-grid">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price}</p>
              <p className="product-quantity">Available: {product.quantity}</p>
              <p className="product-description">{product.description}</p>
              <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
