import React from 'react';
import './ModalConjunto.css';

const ModalConjunto = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          {/* Adicione a classe custom-modal-title no h3 */}
          <h3 className="custom-modal-title">{title}</h3>
          <button className="custom-modal-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
        <div className="custom-modal-footer">
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConjunto;
