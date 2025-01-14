import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './MegaSenaHome.css';

function MegaSenaHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
        {/* Imagem da Mega Sena */}
        <div className="logo-container">
          <img src="/Images/mega_sena.png" alt="Mega Sena" className="mega-sena-logo" />
        </div>

        <h1>Bem-vindo à Mega Sena</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos da Mega Sena.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerador-jogo-megasena" className="btn btn-primary-megasena w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/megasena-estatistica" className="btn btn-primary-megasena w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/historico-de-jogos-megasena" className="btn btn-primary-megasena w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerar-via-arquivo" className="btn btn-primary-megasena w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerar-via-arquivo-favorito" className="btn btn-primary-megasena w-100">
              Gerar favoritos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerar-via-arquivo-balanceados" className="btn btn-primary-megasena w-100">
              Gerar balanceados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerar-via-arquivo-dados" className="btn btn-primary-megasena w-100">
              Gerar baseado em dados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/gerar-via-arquivo-numerologia" className="btn btn-primary-megasena w-100">
              Gerar baseado em Numerologia
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/modo-surpresa" className="btn btn-primary-megasena w-100">
              Modo Surpresa
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/zodiaco" className="btn btn-primary-megasena w-100">
              Zodíaco
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasena/conferir-jogos" className="btn btn-primary-megasena w-100">
              Conferir jogos
            </Link>
          </div>
          <div className="mb-3">
            <Link to="/app/home" className="btn btn-secondary">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MegaSenaHome;
