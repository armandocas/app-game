import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './editarentregador.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function EditarEntregador() {
  const { id } = useParams(); // Utilizando o hook useParams do react-router-dom versão 6

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [fone, setFone] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    // Obtendo o documento específico da coleção 'entregador'
    const entregadorRef = doc(db, 'entregador', id);
    getDoc(entregadorRef)
      .then((resultado) => {
        if (resultado.exists()) {
          const data = resultado.data();
          setCodigo(data.codigo);
          setNome(data.nome);
          setFone(data.fone);
          setPreco(data.preco);
        } else {
          setMensagem('Erro: Documento não encontrado.');
        }
      })
      .catch((erro) => {
        setMensagem('Erro ao buscar dados: ' + erro.message);
      });
  }, [db, id]);

  function AlterarEntregador() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome do Entregador');
    } else if (fone.length === 0) {
      setMensagem('Informe o Telefone do Entregador');
    } else {
      const entregadorRef = doc(db, 'entregador', id);
      updateDoc(entregadorRef, {
        nome: nome,
        fone: fone,
        preco: preco
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
          <h1>Editar Entregador</h1>
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
              <label htmlFor="InputFone" className="form-label">
                Telefone
              </label>
              <input
                onChange={(e) => setFone(e.target.value)}
                value={fone}
                type="text"
                className="form-control"
                id="InputFone"
                aria-describedby="foneHelp"
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
              />
            </div>

            <div className="text-center">
              <Link to="/app/delivery" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={AlterarEntregador} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 && (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            )}
            {sucesso === 'S' && <Navigate to="/app/delivery" replace />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarEntregador;
