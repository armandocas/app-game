import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './SuperSeteHome.css';

function SuperSeteHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
        <h1>Bem-vindo à Super Sete</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos do Super Sete.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersete/gerador-jogo-supersete" className="btn btn-primary-supersete w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersete/estatistica" className="btn btn-primary-supersete w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersete/historico-de-jogos-supersete" className="btn btn-primary-supersete w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersete/gerar-via-arquivo" className="btn btn-primary-supersete w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersete/gerar-via-arquivo-favorito" className="btn btn-primary-supersete w-100">
              Gerar favoritos
            </Link>
          </div>
          {/* <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-balanceados" className="btn btn-primary-supersete w-100">
              Gerar balanceados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-dados" className="btn btn-primary-supersete w-100">
              Gerar baseado em dados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/gerar-via-arquivo-numerologia" className="btn btn-primary-supersete w-100">
              Gerar baseado em Numerologia
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/modo-surpresa" className="btn btn-primary-supersete w-100">
              Modo Surpresa
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quina/zodiaco" className="btn btn-primary-supersete w-100">
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

export default SuperSeteHome;
