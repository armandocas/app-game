import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import ListaEntregador from '../Components/ListaEntregador/listaentregador';
import './listadelivery.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

import SweetAlert from 'react-bootstrap-sweetalert';

import entregadoresPDF from '../Reports/Entregadores/entregadores';

function ListaDelivery() {
  const [entregadores, setEntregadores] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function deleteDelivery(id) {
    const entregadorRef = doc(db, 'entregador', id);
    deleteDoc(entregadorRef)
      .then(() => {
        setExcluido(id);
        setConfirmacao(false);
      })
      .catch((erro) => {
        console.error('Erro ao excluir entregador:', erro);
      });
  }

  function confirmDeleteEntregador(id) {
    setConfirmacaoId(id);
    setConfirmacao(true);
  }

  useEffect(() => {
    const fetchEntregadores = async () => {
      const entregadorCollection = collection(db, 'entregador');
      const entregadorQuery = query(entregadorCollection, orderBy('codigo', 'asc'));

      try {
        const resultado = await getDocs(entregadorQuery);
        let listaEntre = [];
        resultado.docs.forEach((doc) => {
          if (doc.data().nome.indexOf(busca) >= 0) {
            listaEntre.push({
              id: doc.id,
              codigo: doc.data().codigo,
              nome: doc.data().nome,
              fone: doc.data().fone,
              preco: doc.data().preco
            });
          }
        });

        setEntregadores(listaEntre);
      } catch (erro) {
        console.error('Erro ao buscar entregadores:', erro);
      }
    };

    fetchEntregadores();
  }, [db, busca, excluido]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <h1>Entregadores Cadastrados</h1>

        <div className="row">
          <div className="col-4">
            <Link to='/app/novoentregador' className="btn btn-primary btn-cli" type="button">
              <i className="fas fa-plus"></i> Entregador
            </Link>
            <button
              onClick={(e) => entregadoresPDF(entregadores)}
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
                placeholder="Pesquisar por Entregador"
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

        <ListaEntregador arrayEntregadores={entregadores} clickDelete={confirmDeleteEntregador} />

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
            onConfirm={() => deleteDelivery(confirmacaoId)}
            onCancel={() => setConfirmacao(false)}
            reverseButtons={true}
          >
            Deseja excluir o Entregador selecionado?
          </SweetAlert>
        )}
      </div>
    </div>
  );
}

export default ListaDelivery;
