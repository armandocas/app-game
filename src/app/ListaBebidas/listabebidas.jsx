import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import ListaBebida from '../Components/ListaBebida/listabebida';
import './listabebidas.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

import SweetAlert from 'react-bootstrap-sweetalert';

import bebidaPDF from '../Reports/Bebida/bebida';

function ListaBebidas() {
  const [bebidas, setBebidas] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function deleteBebida(id) {
    const bebidaRef = doc(db, 'bebida', id);
    deleteDoc(bebidaRef)
      .then(() => {
        setExcluido(id);
        setConfirmacao(false);
      })
      .catch((erro) => {
        console.error('Erro ao excluir bebida:', erro);
      });
  }

  function confirmDeleteBebidas(id) {
    setConfirmacaoId(id);
    setConfirmacao(true);
  }

  useEffect(() => {
    const fetchBebidas = async () => {
      const bebidaCollection = collection(db, 'bebida');
      const bebidaQuery = query(bebidaCollection, orderBy('codigo', 'asc'));

      try {
        const resultado = await getDocs(bebidaQuery);
        let listaBebi = [];
        resultado.docs.forEach((doc) => {
          if (doc.data().nome.indexOf(busca) >= 0) {
            listaBebi.push({
              id: doc.id,
              codigo: doc.data().codigo,
              nome: doc.data().nome,
              ml_litro: doc.data().ml_litro,
              preco: doc.data().preco,
              quantidade: doc.data().quantidade
            });
          }
        });

        setBebidas(listaBebi);
      } catch (erro) {
        console.error('Erro ao buscar bebidas:', erro);
      }
    };

    fetchBebidas();
  }, [db, busca, excluido]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <h1>Lista de Bebidas</h1>

        <div className="row">
          <div className="col-4">
            <Link to='/app/novabebida' className="btn btn-primary btn-cli" type="button">
              <i className="fas fa-plus"></i> Bebida
            </Link>
            <button
              onClick={(e) => bebidaPDF(bebidas)}
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
                placeholder="Pesquisar por Bebida"
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

        <ListaBebida arrayBebidas={bebidas} clickDelete={confirmDeleteBebidas} />

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
            onConfirm={() => deleteBebida(confirmacaoId)}
            onCancel={() => setConfirmacao(false)}
            reverseButtons={true}
          >
            Deseja excluir a Bebida selecionada?
          </SweetAlert>
        )}
      </div>
    </div>
  );
}

export default ListaBebidas;
