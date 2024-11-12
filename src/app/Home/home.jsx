import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import ListaVisitantes from '../Components/ListaVisitante/listavisitante';
import './home.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import firebaseApp from '../Config/firebase';

import SweetAlert from 'react-bootstrap-sweetalert';

import visitantesPDF from '../Reports/Visitantes/visitantes';

function Home() {
  const [visitantes, setVisitantes] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function deleteUser(id) {
    const visitanteRef = doc(db, 'visitors', id);
    deleteDoc(visitanteRef).then(() => {
      setExcluido(id);
      setConfirmacao(false);
    }).catch((erro) => {
      console.error('Erro ao excluir visitante:', erro);
    });
  }

  function confirmDeleteUser(id) {
    setConfirmacaoId(id);
    setConfirmacao(true);
  }

  useEffect(() => {
    const fetchVisitantes = async () => {
      const visitantesCollection = collection(db, 'visitors');
      try {
        const resultado = await getDocs(visitantesCollection);
        let listaVisi = [];
        resultado.docs.forEach((doc) => {
          if (doc.data().fullName.indexOf(busca) >= 0) {
            listaVisi.push({
              id: doc.id,
              nome: doc.data().fullName || '',
              rua: doc.data().street || '',
              numero: doc.data().num || '',
              bairro: doc.data().district || '',
              fone: doc.data().phoneWhatsApp || '',
              city: doc.data().city || '',
              uf: doc.data().uf || '',
              postalCode: doc.data().postalCode || '',
              complement: doc.data().complement || ''
            });
          }
        });

        setVisitantes(listaVisi);
        console.log("listaVisi:", listaVisi);
      } catch (erro) {
        console.error('Erro ao buscar visitantes:', erro);
      }
    };

    fetchVisitantes();
  }, [db, busca, excluido]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <h1>Home</h1>

        <div className="row">
          <div className="col-4">
            <Link to='/app/novovisitante' className="btn btn-primary btn-cli" type="button">
              <i></i> Adicionar
            </Link>
            <button
              onClick={(e) => visitantesPDF(visitantes)}
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
                placeholder="Pesquisar por nome"
                aria-describedby="button-addon2"
              />
              <button
                onClick={(e) => setBusca(texto)}
                className="btn btn-primary"
                type="button"
                id="button-addon2"
              >
                <i></i> Pesquisar
              </button>
            </div>
          </div>
        </div>

        <ListaVisitantes arrayVisitantes={visitantes} clickDelete={confirmDeleteUser} />

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
            onConfirm={() => deleteUser(confirmacaoId)}
            onCancel={() => setConfirmacao(false)}
            reverseButtons={true}
          >
            Deseja excluir o visitante selecionado?
          </SweetAlert>
        )}
      </div>
    </div>
  );
}

export default Home;
