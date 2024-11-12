import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './novaborda.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function NovaBorda() {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  async function CadastrarBorda() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome da Borda');
    } else if (preco.length === 0) {
      setMensagem('Informe o Valor da Borda');
    } else {
      try {
        await addDoc(collection(db, 'borda'), {
          codigo: codigo,
          nome: nome,
          preco: preco
        });
        setMensagem('');
        setSucesso('S');
      } catch (erro) {
        setMensagem(`Erro ao cadastrar borda: ${erro.message}`);
        setSucesso('N');
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Cadastrar Nova Borda</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="InputCodigo" className="form-label">Código</label>
              <input
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                className="form-control"
                id="InputCodigo"
                aria-describedby="codigoHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputNome" className="form-label">Nome</label>
              <input
                onChange={(e) => setNome(e.target.value)}
                type="text"
                className="form-control"
                id="InputNome"
                aria-describedby="nomeHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputPreco" className="form-label">Preço</label>
              <input
                onChange={(e) => setPreco(e.target.value)}
                type="number"
                className="form-control"
                id="InputPreco"
                aria-describedby="precoHelp"
                placeholder="Apenas Número Ex: 5.99"
                pattern="^[0-9]+\.?[0-9]{0,2}$"
              />
            </div>

            <div className="text-center">
              <Link to="/app/borda" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={CadastrarBorda} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? <Navigate to='/app/borda' /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovaBorda;
