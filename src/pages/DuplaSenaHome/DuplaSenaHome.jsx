import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './DuplaSenaHome.css';

function DuplaSenaHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
          <div className="logo-container">
          <img src="/Images/dupla_sena.png" alt="Dupla Sena" className="duplasena-logo" />
        </div>
        
        <h1>Bem-vindo à Dupla Sena</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos da Dupla Sena.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/duplasena/gerador-jogo-duplasena" className="btn btn-primary-duplasena w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/duplasena-estatistica" className="btn btn-primary-duplasena w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/duplasena/historico-de-jogos-lotofacil" className="btn btn-primary-duplasena w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/duplasena/gerar-via-arquivo" className="btn btn-primary-duplasena w-100">
              Gerar via arquivo
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

export default DuplaSenaHome;
