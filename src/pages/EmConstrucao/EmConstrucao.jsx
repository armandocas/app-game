import React from 'react';
import { Link } from 'react-router-dom';
import './EmConstrucao.css';

function EmConstrucao() {
  return (
    <div className="container em-construcao-container">
      <h1>🚧 Página em Construção 🚧</h1>
      <p>Estamos trabalhando para trazer essa funcionalidade o mais rápido possível!</p>
      <div className="imagem-construcao">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1024/1024716.png"
          alt="Em Construção"
          className="imagem"
        />
      </div>
      <div className="botoes-container">
        <Link to="/app/home" className="btn btn-secondary">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}

export default EmConstrucao;
