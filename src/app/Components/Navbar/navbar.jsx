import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { AuthContext } from '../../Context/auth';

function Navbar() {

  const { setLogado } = useContext(AuthContext);

  function Logout() {
    setLogado(false);
    localStorage.removeItem("logado");
  }

  return <nav className="navbar fixed-top navbar-expand-md navbar-dark">

    <div className="container-fluid">

      <a className="navbar-brand" href="/#">
      </a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/app/home" className="nav-link" aria-current="page" >Home</Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/app/saboreslista" className="nav-link" aria-current="page" >Lista de Sabores</Link>
          </li>
          <li className="nav-item">
            <Link to="/app/delivery" className="nav-link" aria-current="page" >Delivery</Link>
          </li>
          <li className="nav-item">
            <Link to="/app/borda" className="nav-link" aria-current="page" >Borda</Link>
          </li>
          <li className="nav-item">
            <Link to="/app/bebidas" className="nav-link" aria-current="page" >Bebidas</Link>
          </li> */}
          <li className="nav-item">
            <a href="/" onClick={Logout} className="nav-link logout" aria-current="page" >Sair</a>
          </li>
        </ul>
      </div>

    </div>
  </nav>;
}

export default Navbar;