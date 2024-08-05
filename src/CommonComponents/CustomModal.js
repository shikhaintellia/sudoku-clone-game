import React from "react";
import "../style/modal.css";

const Modal = ({ show, children, darkMode }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className={`modal-content ${darkMode ? "dark-mode" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
