import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './QuinaHome.css';

function QuinaHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
         {/* Imagem da Quina */}
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
            <Link to="/app/quina/megasena-estatistica" className="btn btn-primary-quina w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/historico-de-jogos-megasena" className="btn btn-primary-quina w-100">
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
          {/* <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-balanceados" className="btn btn-primary w-100">
              Gerar balanceados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-dados" className="btn btn-primary w-100">
              Gerar baseado em dados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-numerologia" className="btn btn-primary w-100">
              Gerar baseado em Numerologia
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/modo-surpresa" className="btn btn-primary w-100">
              Modo Surpresa
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/zodiaco" className="btn btn-primary w-100">
              Zodíaco
            </Link>
          </div> */}
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