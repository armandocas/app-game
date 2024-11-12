import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './novosabor.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

function NovoSabor() {
  const [codigo, setCodigo] = useState('');
  const [sabor, setSabor] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preco, setPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  async function CadastrarPedido() {
    if (sabor.length === 0) {
      setMensagem('Informe o Sabor');
    } else if (ingredientes.length === 0) {
      setMensagem('Informe os Ingredientes');
    } else {
      try {
        await addDoc(collection(db, 'pizza'), {
          codigo: codigo,
          sabor: sabor,
          ingredientes: ingredientes,
          preco: preco
        });
        setMensagem('');
        setSucesso('S');
      } catch (erro) {
        setMensagem(`Erro ao cadastrar sabor: ${erro.message}`);
        setSucesso('N');
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Cadastrar Novo Sabor</h1>
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
              <label htmlFor="InputSabor" className="form-label">Sabor</label>
              <input
                onChange={(e) => setSabor(e.target.value)}
                type="text"
                className="form-control"
                id="InputSabor"
                aria-describedby="saborHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="InputIngredientes" className="form-label">Ingredientes</label>
              <input
                onChange={(e) => setIngredientes(e.target.value)}
                type="text"
                className="form-control"
                id="InputIngredientes"
                aria-describedby="ingredientesHelp"
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
              <Link to="/app/saboreslista" className="btn btn-outline-primary btn-acao">
                Cancelar
              </Link>
              <button onClick={CadastrarPedido} type="button" className="btn btn-primary btn-acao">
                Salvar
              </button>
            </div>

            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? <Navigate to='/app/saboreslista' /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoSabor;
