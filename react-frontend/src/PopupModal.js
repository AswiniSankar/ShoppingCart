import React from "react";
import "./PopupModal.css"; // Add some styles

const PopupModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{message}</h3>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupModal;
