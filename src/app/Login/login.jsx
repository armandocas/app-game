import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './login.css';
import { AuthContext } from '../Context/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from '../../Config/firebase';

function Login() {
  const ano = new Date();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sucesso, setSucesso] = useState('');
  const { setLogado, setUser } = useContext(AuthContext); // Captura o `setUser` do contexto

  const auth = getAuth(firebaseApp);

  function LoginUsuario() {
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user; // Captura o usuário autenticado
        localStorage.setItem("logado", "S");
        setLogado(true);
        setUser(user); // Armazena o usuário no contexto
        setSucesso('S');
      })
      .catch((error) => {
        localStorage.setItem("logado", "N");
        setLogado(false);
        setSucesso('N');
      });
  }

  function alterarEmail(event) {
    setEmail(event.target.value);
  }

  function alterarSenha(event) {
    setSenha(event.target.value);
  }

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-signin">
        <img className="mb-4 logo-small" src="Images/trevo-logo-removebg.png" alt="Logo Trevo Zillionaire" />

        <div className="form-floating">
          <input
            onChange={alterarEmail}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="E-mail"
          />
          <label htmlFor="floatingInput">E-mail</label>
        </div>

        <div className="form-floating">
          <input
            onChange={alterarSenha}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                LoginUsuario();
              }
            }}
            type="password"
            className="form-control mt-3"
            id="floatingPassword"
            placeholder="Senha"
          />
          <label htmlFor="floatingPassword">Senha</label>
        </div>

        <button
          onClick={LoginUsuario}
          className="w-100 btn btn-lg btn-primary mt-3"
          type="button"
        >
          Acessar
        </button>

        {sucesso === 'N' && (
          <div className="alert alert-danger mt-2" role="alert">
            E-mail ou senha inválida.
          </div>
        )}
        {sucesso === 'S' && <Navigate to="/app/home" replace />}

        <div className="login-links mt-5">
          <Link to="/app/resetsenha" className="mx-3">
            Esqueci minha senha
          </Link>
          <Link to="/app/novaconta" className="mx-3">
            Criar uma conta
          </Link>
        </div>

        <p className="mt-5 mb-3 text-muted">&copy; {ano.getFullYear()}</p>
      </form>
    </div>
  );
}

export default Login;
