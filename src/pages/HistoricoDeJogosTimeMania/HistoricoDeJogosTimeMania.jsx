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
import "./HistoricoDeJogosTimeMania.css";

const db = getFirestore(firebaseApp);

function HistoricoDeJogosTimeMania() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [finalDaLista, setFinalDaLista] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_timemania"),
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
        collection(db, "historico_timemania"),
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
      <h1>Histórico de Jogos - Timemania</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data</th>
              <th>Números Sorteados</th>
              <th>Detalhes do Prêmio</th>
              <th>Time do Coração</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados.map((numero, idx) => (
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
                        <th>Prêmio</th>
                        <th>Ganhadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>7</td>
                        <td>{jogo.premios?.v1a || "N/A"}</td>
                        <td>{jogo.premios?.w1a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>{jogo.premios?.v2a || "N/A"}</td>
                        <td>{jogo.premios?.w2a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>{jogo.premios?.v3a || "N/A"}</td>
                        <td>{jogo.premios?.w3a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>{jogo.premios?.v4a || "N/A"}</td>
                        <td>{jogo.premios?.w4a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>{jogo.premios?.v5a || "N/A"}</td>
                        <td>{jogo.premios?.w5a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>TIME</td>
                        <td>{jogo.premios?.tcv || "N/A"}</td>
                        <td>{jogo.premios?.tcw || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <div className="time-coracao">
                    <p>Nome: {jogo.time_coracao?.nome || "N/A"}</p>
                    <p>Valor: {jogo.time_coracao?.valor || "N/A"}</p>
                    <p>Ganhadores: {jogo.time_coracao?.ganhadores || "N/A"}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/timemaniahome" className="btn btn-secondary">
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

export default HistoricoDeJogosTimeMania;