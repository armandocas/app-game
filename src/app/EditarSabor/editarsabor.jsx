import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './editarsabor.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function EditarSabor() {
  const { id } = useParams(); // Utilizando o hook useParams para obter o ID da pizza

  const [codigo, setCodigo] = useState('');
  const [sabor, setSabor] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    // Obtendo o documento específico da coleção 'pizza'
    const pizzaRef = doc(db, 'pizza', id);
    getDoc(pizzaRef)
      .then((resultado) => {
        if (resultado.exists()) {
          const data = resultado.data();
          setCodigo(data.codigo);
          setSabor(data.sabor);
          setIngredientes(data.ingredientes);
          setPreco(data.preco);
        } else {
          setMensagem('Erro: Documento não encontrado.');
        }
      })
      .catch((erro) => {
        setMensagem('Erro ao buscar dados: ' + erro.message);
      });
  }, [db, id]);

  function AlterarSabor() {
    if (sabor.length === 0) {
      setMensagem('Informe o sabor');
    } else if (ingredientes.length === 0) {
      setMensagem('Informe os Ingredientes');
    } else {
      const pizzaRef = doc(db, 'pizza', id);
      updateDoc(pizzaRef, {
        sabor: sabor,
        ingredientes: ingredientes,
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
          <h1>Editar Sabor</h1>
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
              <label htmlFor="InputSabor" className="form-label">
                Sabor
              </label>
              <input
                onChange={(e) => setSabor(e.target.value)}
                value={sabor}
                type="text"
                className="form-control"
                id="InputSabor"
                aria-describedby="saborHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputIngredientes" className="form-label">
                Ingredientes
              </label>
              <input
                onChange={(e) => setIngredientes(e.target.value)}
                value={ingredientes}
                type="text"
                className="form-control"
                id="InputIngredientes"
                aria-describedby="ingredientesHelp"
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
              <Link to="/app/saboreslista" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={AlterarSabor} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 && (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            )}
            {sucesso === 'S' && <Navigate to="/app/saboreslista" replace />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarSabor;
