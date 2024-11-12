import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import ListaSabor from '../Components/ListaSabor/listasabor';
import './listasabores.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

import SweetAlert from 'react-bootstrap-sweetalert';

import saboresPDF from '../Reports/Sabores/sabores';

function ListaSabores() {
  const [sabores, setSabores] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function deleteSabor(id) {
    const saborRef = doc(db, 'pizza', id);
    deleteDoc(saborRef)
      .then(() => {
        setExcluido(id);
        setConfirmacao(false);
      })
      .catch((erro) => {
        console.error('Erro ao excluir sabor:', erro);
      });
  }

  function confirmDeleteSabor(id) {
    setConfirmacaoId(id);
    setConfirmacao(true);
  }

  useEffect(() => {
    const fetchSabores = async () => {
      const saborCollection = collection(db, 'pizza');
      const saborQuery = query(saborCollection, orderBy('codigo', 'asc'));

      try {
        const resultado = await getDocs(saborQuery);
        let listaSab = [];
        resultado.docs.forEach((doc) => {
          if (doc.data().sabor.indexOf(busca) >= 0) {
            listaSab.push({
              id: doc.id,
              codigo: doc.data().codigo,
              sabor: doc.data().sabor,
              ingredientes: doc.data().ingredientes,
              preco: doc.data().preco
            });
          }
        });

        setSabores(listaSab);
      } catch (erro) {
        console.error('Erro ao buscar sabores:', erro);
      }
    };

    fetchSabores();
  }, [db, busca, excluido]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <h1>Sabores Cadastrados</h1>

        <div className="row">
          <div className="col-4">
            <Link to='/app/novosabor' className="btn btn-primary btn-cli" type="button">
              <i className="fas fa-plus"></i> Sabor
            </Link>
            <button
              onClick={(e) => saboresPDF(sabores)}
              className="btn btn-danger btn-cli"
              type="submit"
              target="_blank"
              id="button-addon2"
            >
              Gerar PDF
            </button>
          </div>

          <div className="col-8">
            <div className="input-group mb-3">
              <input
                onChange={(e) => setTexto(e.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    setBusca(texto);
                  }
                }}
                type="text"
                className="form-control"
                placeholder="Pesquisar por sabor"
                aria-describedby="button-addon2"
              />
              <button
                onClick={(e) => setBusca(texto)}
                className="btn btn-primary"
                type="button"
                id="button-addon2"
              >
                <i className="fas fa-search"></i> Pesquisar
              </button>
            </div>
          </div>
        </div>

        <ListaSabor arrayPizzas={sabores} clickDelete={confirmDeleteSabor} />

        {confirmacao && (
          <SweetAlert
            warning
            showCancel
            showCloseButton
            confirmBtnText="Sim"
            confirmBtnBsStyle="danger"
            cancelBtnText="Não"
            cancelBtnBsStyle="light"
            title="Exclusão"
            onConfirm={() => deleteSabor(confirmacaoId)}
            onCancel={() => setConfirmacao(false)}
            reverseButtons={true}
          >
            Deseja excluir o Sabor selecionado?
          </SweetAlert>
        )}
      </div>
    </div>
  );
}

export default ListaSabores;
