import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './LotoManiaHome.css';

function LotoManiaHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
         <div className="logo-container">
          <img src="/Images/lotomania.png" alt="lotomania" className="lotomania-logo" />
        </div>

        <h1>Bem-vindo à LotoMania</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos da LotoMania.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerador-jogo-lotomania" className="btn btn-primary-lotomania w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/historico-de-jogos-lotomania" className="btn btn-primary-lotomania w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/estatistica" className="btn btn-primary-lotomania w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerar-via-arquivo" className="btn btn-primary-lotomania w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerar-via-arquivo-favorito" className="btn btn-primary-lotomania w-100">
              Gerar favoritos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerar-via-arquivo-balanceado" className="btn btn-primary-lotomania w-100">
              Gerar balanceados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerar-via-arquivo-dados" className="btn btn-primary-lotomania w-100">
              Gerar baseados em dados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/gerar-via-numerologia" className="btn btn-primary-lotomania w-100">
              Gerar baseados em numerologia
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/modo-surpresa" className="btn btn-primary-lotomania w-100">
              Modo surpresa
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/zodiaco" className="btn btn-primary-lotomania w-100">
              Zodiaco
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomania/conferir-jogos" className="btn btn-primary-lotomania w-100">
              Conferir jogos
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

export default LotoManiaHome;
