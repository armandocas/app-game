import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './novoentregador.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function NovoEntregador() {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [fone, setFone] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  async function CadastrarEntregador() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome do Entregador');
    } else if (fone.length === 0) {
      setMensagem('Informe o Telefone do Entregador');
    } else {
      try {
        await addDoc(collection(db, 'entregador'), {
          codigo: codigo,
          nome: nome,
          fone: fone,
          preco: preco
        });
        setMensagem('');
        setSucesso('S');
      } catch (erro) {
        setMensagem(`Erro ao cadastrar entregador: ${erro.message}`);
        setSucesso('N');
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Cadastrar Novo Entregador</h1>
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
              <label htmlFor="InputFone" className="form-label">Telefone</label>
              <input
                onChange={(e) => setFone(e.target.value)}
                type="text"
                className="form-control"
                id="InputFone"
                aria-describedby="foneHelp"
                placeholder="(99) 9999-9999"
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
              <Link to="/app/delivery" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={CadastrarEntregador} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? <Navigate to='/app/delivery' /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoEntregador;
