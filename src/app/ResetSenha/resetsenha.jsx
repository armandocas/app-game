import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './resetsenha.css';

// Importando métodos específicos do Firebase v9
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseApp from '../../Config/firebase';

function ResetSenha() {
  const ano = new Date();

  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState({ text: '', type: '' });
  const spam = 'Obs: Caso não encontre o e-mail, verifique seu Spam.';

  // Obtendo a instância de autenticação do Firebase
  const auth = getAuth(firebaseApp);

  async function recuperarSenha() {
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem({
        text: 'Email enviado com sucesso! ' + spam,
        type: 'success'
      });
    } catch (erro) {
      setMensagem({
        text: 'Erro ao enviar email: ' + erro.message,
        type: 'error'
      });
    }
  }

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-signin">
        <img className="mb-4" src="/Images/logo.png" alt="Logo Centralidade" />
        <h1 className="h3 mb-3 fw-normal">Recuperar Senha</h1>

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

        <button
          onClick={recuperarSenha}
          className="w-100 btn btn-lg btn-primary mt-3"
          type="button"
        >
          Enviar
        </button>

        {mensagem.text.length > 0 && (
          <div className={`alert mt-2 ${mensagem.type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">
            {mensagem.text}
          </div>
        )}

        <div className="login-links mt-5">
          <Link to="/app/novaconta" className="mx-3">
            Criar uma conta.
          </Link>
        </div>

        <p className="mt-5 mb-3 text-muted">&copy; {ano.getFullYear()}</p>
      </form>
    </div>
  );
}

export default ResetSenha;
