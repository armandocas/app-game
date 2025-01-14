import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './novaconta.css';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from '../../Config/firebase';

function NovaConta() {
  const ano = new Date();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('');

  const auth = getAuth(firebaseApp);

  function cadastrarUsuario() {
    setMensagem('');

    if (!email || !senha) {
      setMensagem('Informe todos os campos');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setSucesso('S');
      })
      .catch((error) => {
        setSucesso('N');
        if (error.message.includes('Password should be at least 6 characters')) {
          setMensagem('A senha deve ter pelo menos 6 caracteres');
        } else if (error.message.includes('The email address is badly formatted')) {
          setMensagem('O email não é válido');
        } else if (error.message.includes('The email address is already in use by another account')) {
          setMensagem('Esse email já está em uso por outra conta');
        } else {
          setMensagem('Erro ao criar conta: ' + error.message);
        }
      });
  }

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-signin">
        <img className="mb-4 logo-small" src="/Images/trevo-logo-removebg.png" alt="Logo Trevo Zillionaire"/>
        <h1 className="h3 mb-3 fw-normal">Criar Conta</h1>

        <div className="form-floating">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="E-mail"
          />
          <label htmlFor="floatingInput">E-mail</label>
        </div>

        <div className="form-floating">
          <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            className="form-control mt-3"
            id="floatingPassword"
            placeholder="Senha"
          />
          <label htmlFor="floatingPassword">Senha</label>
        </div>

        <button
          onClick={cadastrarUsuario}
          className="w-100 btn btn-lg btn-primary mt-3"
          type="button"
        >
          Criar conta
        </button>

        {mensagem.length > 0 && (
          <div className="alert alert-danger mt-2" role="alert">
            {mensagem}
          </div>
        )}
        {sucesso === 'S' && <Navigate to="/app/home" replace />}

        <div className="login-links mt-5">
          <Link to="/" className="mx-3">
            Já tenho uma conta.
          </Link>
        </div>

        <p className="mt-5 mb-3 text-muted">&copy; {ano.getFullYear()}</p>
      </form>
    </div>
  );
}

export default NovaConta;
