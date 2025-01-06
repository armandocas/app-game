import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../app/Components/Navbar/navbar';
import './LotoFacilHome.css';

function LotoFacilHome() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
        {/* Imagem da LotoFacil */}
        <div className="logo-container">
          <img src="/Images/loto_facil.png" alt="Loto_Facil" className="loto-facil-logo" />
        </div>

        <h1>Bem-vindo à Lotofácil</h1>
        <p className="lead">Escolha uma das opções abaixo para gerenciar ou criar jogos da Lotofácil.</p>

        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerador-jogo-lotofacil" className="btn btn-primary-lotofacil w-100">
              Gerar Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil-estatistica" className="btn btn-primary-lotofacil w-100">
              Estatísticas
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/historico-de-jogos-lotofacil" className="btn btn-primary-lotofacil w-100">
              Histórico de Jogos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo" className="btn btn-primary-lotofacil w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo-favorito" className="btn btn-primary-lotofacil w-100">
              Gerar Favoritos
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo-balanceado" className="btn btn-primary-lotofacil w-100">
              Gerar Balanceados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo-dados" className="btn btn-primary-lotofacil w-100">
              Gerar baseado em dados
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo" className="btn btn-primary-lotofacil w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo" className="btn btn-primary-lotofacil w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacil/gerar-via-arquivo" className="btn btn-primary-lotofacil w-100">
              Gerar via arquivo
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/home" className="btn btn-secondary">
              Voltar para Home
            </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LotoFacilHome;
