import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './novabebida.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function NovaBebida() {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [quantestoque, setQuantiEstoque] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  async function CadastrarBebida() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome da Bebida');
    } else if (preco.length === 0) {
      setMensagem('Informe o Valor da Bebida');
    } else {
      try {
        await addDoc(collection(db, 'bebida'), {
          codigo: codigo,
          nome: nome,
          ml_litro: quantidade,
          preco: preco,
          quantidade: quantestoque
        });
        setMensagem('');
        setSucesso('S');
      } catch (erro) {
        setMensagem(`Erro ao cadastrar bebida: ${erro.message}`);
        setSucesso('N');
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Cadastrar Nova Bebida</h1>
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
              <label htmlFor="InputQuantidade" className="form-label">Quantidade ML-L</label>
              <input
                onChange={(e) => setQuantidade(e.target.value)}
                type="text"
                className="form-control"
                id="InputQuantidade"
                aria-describedby="quantidadeHelp"
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

            <div className="mb-3">
              <label htmlFor="InputQuantEstoque" className="form-label">Quantidade em Estoque</label>
              <input
                onChange={(e) => setQuantiEstoque(e.target.value)}
                type="number"
                className="form-control"
                id="InputQuantEstoque"
                aria-describedby="quantestoqueHelp"
                pattern="^[0-9]+\.?[0-9]{0,2}$"
              />
            </div>

            <div className="text-center">
              <Link to="/app/bebidas" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={CadastrarBebida} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? <Navigate to='/app/bebidas' /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovaBebida;
