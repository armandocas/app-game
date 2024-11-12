import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './editarbebidas.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function EditarBebidas() {
  const { id } = useParams(); // Utilizando o hook useParams do react-router-dom versão 6

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [quantestoque, setQuantiEstoque] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    // Obtendo o documento específico da coleção 'bebida'
    const bebidaRef = doc(db, 'bebida', id);
    getDoc(bebidaRef).then((resultado) => {
      if (resultado.exists()) {
        const data = resultado.data();
        setCodigo(data.codigo);
        setNome(data.nome);
        setQuantidade(data.ml_litro);
        setPreco(data.preco);
        setQuantiEstoque(data.quantidade);
      } else {
        setMensagem('Erro: Documento não encontrado.');
      }
    }).catch((erro) => {
      setMensagem('Erro ao buscar dados: ' + erro.message);
    });
  }, [db, id]);

  function AlterarBebida() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome da Bebida');
    } else if (preco.length === 0) {
      setMensagem('Informe o valor da Bebida');
    } else {
      const bebidaRef = doc(db, 'bebida', id);
      updateDoc(bebidaRef, {
        nome: nome,
        ml_litro: quantidade,
        preco: preco,
        quantidade: quantestoque
      })
        .then(() => {
          setMensagem('');
          setSucesso('S');
        })
        .catch((erro) => {
          setMensagem('Erro ao salvar alterações: ' + erro.message);
          setSucesso('N');
        });
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Editar Bebida</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="InputCodigo" className="form-label">
                Código
              </label>
              <input
                type="text"
                value={codigo}
                className="form-control"
                id="InputCodigo"
                aria-describedby="codigoHelp"
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputNome" className="form-label">
                Nome
              </label>
              <input
                onChange={(e) => setNome(e.target.value)}
                value={nome}
                type="text"
                className="form-control"
                id="InputNome"
                aria-describedby="nomeHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputQuantidade" className="form-label">
                Quantidade ML - L
              </label>
              <input
                onChange={(e) => setQuantidade(e.target.value)}
                value={quantidade}
                type="text"
                className="form-control"
                id="InputQuantidade"
                aria-describedby="quantidadeHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputPreco" className="form-label">
                Preço
              </label>
              <input
                onChange={(e) => setPreco(e.target.value)}
                value={preco}
                type="number"
                className="form-control"
                id="InputPreco"
                aria-describedby="precoHelp"
                pattern="[0-9]+$"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputQuantEstoque" className="form-label">
                Quantidade em Estoque
              </label>
              <input
                onChange={(e) => setQuantiEstoque(e.target.value)}
                value={quantestoque}
                type="number"
                className="form-control"
                id="InputQuantEstoque"
                aria-describedby="quantestoqueHelp"
                pattern="[0-9]+$"
              />
            </div>

            <div className="text-center">
              <Link to="/app/bebidas" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={AlterarBebida} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 && (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            )}
            {sucesso === 'S' && <Navigate to="/app/bebidas" replace />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarBebidas;
