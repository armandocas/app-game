import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './home.css';

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo text-center">
        <h1>Bem-vindo ao Gerenciador de Jogos!</h1>
        <p className="lead">Selecione um dos jogos abaixo para inserir ou gerenciar seus jogos.</p>
        
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/megasenahome" className="btn btn-primary w-100">
              Mega Sena
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotofacilhome" className="btn btn-primary w-100">
              LotoFácil
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/quinahome" className="btn btn-primary w-100">
              Quina
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/lotomaniahome" className="btn btn-primary w-100">
              Lotomania
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/duplasenahome" className="btn btn-primary w-100">
              Dupla Sena
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/timemaniahome" className="btn btn-primary w-100">
              Timemania
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/dia-de-sorte-home" className="btn btn-primary w-100">
              Dia de Sorte
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/supersetehome" className="btn btn-primary w-100">
              Super Sete
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Link to="/app/milionariahome" className="btn btn-primary w-100">
              +Milionária
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
