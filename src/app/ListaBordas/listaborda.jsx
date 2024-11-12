import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import ListadeBorda from '../Components/ListaBorda/listaborda';
import './listaborda.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

import SweetAlert from 'react-bootstrap-sweetalert';

import bordasPDF from '../Reports/Borda/borda';

function ListaBorda() {
  const [borda, setBorda] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function deleteBorda(id) {
    const bordaRef = doc(db, 'borda', id);
    deleteDoc(bordaRef)
      .then(() => {
        setExcluido(id);
        setConfirmacao(false);
      })
      .catch((erro) => {
        console.error('Erro ao excluir borda:', erro);
      });
  }

  function confirmDeleteBorda(id) {
    setConfirmacaoId(id);
    setConfirmacao(true);
  }

  useEffect(() => {
    const fetchBordas = async () => {
      const bordaCollection = collection(db, 'borda');
      const bordaQuery = query(bordaCollection, orderBy('codigo', 'asc'));

      try {
        const resultado = await getDocs(bordaQuery);
        let listaBor = [];
        resultado.docs.forEach((doc) => {
          if (doc.data().nome.indexOf(busca) >= 0) {
            listaBor.push({
              id: doc.id,
              codigo: doc.data().codigo,
              nome: doc.data().nome,
              preco: doc.data().preco
            });
          }
        });

        setBorda(listaBor);
      } catch (erro) {
        console.error('Erro ao buscar bordas:', erro);
      }
    };

    fetchBordas();
  }, [db, busca, excluido]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <h1>Bordas Cadastradas</h1>

        <div className="row">
          <div className="col-4">
            <Link to='/app/novaborda' className="btn btn-primary btn-cli" type="button">
              <i className="fas fa-plus"></i> Borda
            </Link>
            <button
              onClick={(e) => bordasPDF(borda)}
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
                placeholder="Pesquisar por Borda"
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

        <ListadeBorda arrayBordas={borda} clickDelete={confirmDeleteBorda} />

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
            onConfirm={() => deleteBorda(confirmacaoId)}
            onCancel={() => setConfirmacao(false)}
            reverseButtons={true}
          >
            Deseja excluir a Borda selecionada?
          </SweetAlert>
        )}
      </div>
    </div>
  );
}

export default ListaBorda;
