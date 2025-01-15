import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './QuinaHome.css';

function QuinaHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
        <div className="logo-container">
          <img src="/Images/quina.png" alt="quina" className="quina-logo" />
        </div>

        <h1>Bem-vindo à Quina</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos da Quina.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerador-jogo-quina" className="btn btn-primary-quina w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/estatistica" className="btn btn-primary-quina w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/historico-de-jogos-quina" className="btn btn-primary-quina w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo" className="btn btn-primary-quina w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-favorito" className="btn btn-primary-quina w-100">
              Gerar favoritos
            </Link>
          </div>
          <div className="mt-3">
            <Link to="/app/home" className="btn btn-secondary">
              Voltar para Home
            </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default QuinaHome;
