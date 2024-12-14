import React, { useState, useEffect } from "react";
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
import "./HistoricoJogoLotoFacil.css";

// Instância do Firestore
const db = getFirestore(firebaseApp);

function HistoricoJogoLotoFacil() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [lastVisible, setLastVisible] = useState(null); // Último documento visível
  const [finalDaLista, setFinalDaLista] = useState(false); // Indica se chegamos ao final da coleção

  // Função para carregar a primeira página de dados
  async function carregarDados() {
    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_lotofacil"),
        orderBy("sorteio", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      setDados(novosDados);

      // Armazena o último documento visível para paginação
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Verifica se há mais documentos para carregar
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  // Função para carregar mais dados
  async function carregarMaisDados() {
    if (finalDaLista || !lastVisible) return; // Não carrega mais se já estiver no final

    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_lotofacil"),
        orderBy("sorteio", "desc"),
        startAfter(lastVisible),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      setDados((prevDados) => [...prevDados, ...novosDados]);

      // Atualiza o último documento visível
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Verifica se chegamos ao final da coleção
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar mais dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  // Função para exibir cidades ou mensagem de acumulação
  function renderCidadesOuAcumulacao(jogo) {
    if (jogo.cidades.length > 0) {
      return jogo.cidades.map((cidade, idx) => (
        <div key={idx}>
          {cidade.cidade} - {cidade.estado}
        </div>
      ));
    } else {
      return (
        <div>
          <strong>🚨 ACUMULOU! 🚨</strong> <br />
          💰 Próximo prêmio: <strong>{jogo.valor_do_proximo_premio}</strong> <br />
          📍 Data do próximo sorteio: <strong>{jogo.data_de_fechamento}</strong>
        </div>
      );
    }
  }

  // Carrega os dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - LotoFácil</h1>

      {carregando && <p>Carregando...</p>}
      <div className="tabela-container">
        <table className="table">
          <thead>
            <tr>
              <th>Concurso</th>
              <th>Data</th>
              <th>Números Sorteados</th>
              <th>Detalhes do Prêmio</th>
              <th>Cidades dos Ganhadores</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>{jogo.numeros_sorteados.join(", ")}</td>
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
                        <td>15</td>
                        <td>{jogo.premios.v1a}</td>
                        <td>{jogo.premios.w1a}</td>
                      </tr>
                      <tr>
                        <td>14</td>
                        <td>{jogo.premios.v2a}</td>
                        <td>{jogo.premios.w2a}</td>
                      </tr>
                      <tr>
                        <td>13</td>
                        <td>{jogo.premios.v3a}</td>
                        <td>{jogo.premios.w3a}</td>
                      </tr>
                      <tr>
                        <td>12</td>
                        <td>{jogo.premios.v4a}</td>
                        <td>{jogo.premios.w4a}</td>
                      </tr>
                      <tr>
                        <td>11</td>
                        <td>{jogo.premios.v5a}</td>
                        <td>{jogo.premios.w5a}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>{renderCidadesOuAcumulacao(jogo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default HistoricoJogoLotoFacil;
