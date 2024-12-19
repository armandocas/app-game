import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <button className="btn btn-danger" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default Modal;
