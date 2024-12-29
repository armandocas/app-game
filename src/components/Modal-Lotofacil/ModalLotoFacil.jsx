import React from 'react';
import './ModalLotoFacil.css';

function ModalLotoFacil({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>{/*Conteúdo do Modal bolinhas*/}
        <div className='modal-footer'>
        <button className="btn btn-danger" onClick={onClose}>
          Fechar
        </button>
        </div>
      </div>
    </div>
  );
}

export default ModalLotoFacil;
