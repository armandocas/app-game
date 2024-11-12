import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './editarborda.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function EditarBorda() {
  const { id } = useParams(); // Utilizando o hook useParams para obter o ID da borda

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    // Obtendo o documento específico da coleção 'borda'
    const bordaRef = doc(db, 'borda', id);
    getDoc(bordaRef)
      .then((resultado) => {
        if (resultado.exists()) {
          const data = resultado.data();
          setCodigo(data.codigo);
          setNome(data.nome);
          setPreco(data.preco);
        } else {
          setMensagem('Erro: Documento não encontrado.');
        }
      })
      .catch((erro) => {
        setMensagem('Erro ao buscar dados: ' + erro.message);
      });
  }, [db, id]);

  function AlterarBorda() {
    if (nome.length === 0) {
      setMensagem('Informe o Nome da Borda');
    } else if (preco.length === 0) {
      setMensagem('Informe o valor da Borda');
    } else {
      const bordaRef = doc(db, 'borda', id);
      updateDoc(bordaRef, {
        nome: nome,
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
          <h1>Editar Borda</h1>
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
              <Link to="/app/borda" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={AlterarBorda} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 && (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            )}
            {sucesso === 'S' && <Navigate to="/app/borda" replace />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarBorda;
