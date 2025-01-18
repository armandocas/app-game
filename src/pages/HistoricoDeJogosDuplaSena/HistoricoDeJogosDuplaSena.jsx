import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./HistoricoDeJogosDuplaSena.css";

const db = getFirestore(firebaseApp);

function HistoricoDeJogosDuplaSena() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [finalDaLista, setFinalDaLista] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_duplasena"),
        orderBy("sorteio", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      setDados(novosDados);

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
      toast.error("Erro ao carregar dados!");
    } finally {
      setCarregando(false);
    }
  }

  async function carregarMaisDados() {
    if (finalDaLista || !lastVisible) return;

    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_duplasena"),
        orderBy("sorteio", "desc"),
        startAfter(lastVisible),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      setDados((prevDados) => [...prevDados, ...novosDados]);

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar mais dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Jogos - Dupla Sena</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data</th>
              <th>Números Sorteados (1º Sorteio)</th>
              <th>Números Sorteados (2º Sorteio)</th>
              <th>Detalhes do Prêmio</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados_primeiro.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados_segundo.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <table className="premio-detalhes">
                    <thead>
                      <tr>
                        <th>Acertos</th>
                        <th>Prêmio (1º Sorteio)</th>
                        <th>Ganhadores</th>
                        <th>Prêmio (2º Sorteio)</th>
                        <th>Ganhadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>6</td>
                        <td>{jogo.premios_primeiro?.v1a || "N/A"}</td>
                        <td>{jogo.premios_primeiro?.w1a || "N/A"}</td>
                        <td>{jogo.premios_segundo?.v1b || "N/A"}</td>
                        <td>{jogo.premios_segundo?.w1b || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>{jogo.premios_primeiro?.v2a || "N/A"}</td>
                        <td>{jogo.premios_primeiro?.w2a || "N/A"}</td>
                        <td>{jogo.premios_segundo?.v2b || "N/A"}</td>
                        <td>{jogo.premios_segundo?.w2b || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>{jogo.premios_primeiro?.v3a || "N/A"}</td>
                        <td>{jogo.premios_primeiro?.w3a || "N/A"}</td>
                        <td>{jogo.premios_segundo?.v3b || "N/A"}</td>
                        <td>{jogo.premios_segundo?.w3b || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>{jogo.premios_primeiro?.v4a || "N/A"}</td>
                        <td>{jogo.premios_primeiro?.w4a || "N/A"}</td>
                        <td>{jogo.premios_segundo?.v4b || "N/A"}</td>
                        <td>{jogo.premios_segundo?.w4b || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/duplasenahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
      {!finalDaLista && (
        <button
          className="btn btn-primary mt-3"
          onClick={carregarMaisDados}
          disabled={carregando}
        >
          Carregar Jogos Anteriores
        </button>
      )}
    </div>
  );
}

export default HistoricoDeJogosDuplaSena;
