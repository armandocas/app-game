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
import "./HistoricoJogoMegaSena.css";

const db = getFirestore(firebaseApp);

function HistoricoJogoMegaSena() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [finalDaLista, setFinalDaLista] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_megasena"),
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
    } finally {
      setCarregando(false);
    }
  }

  async function carregarMaisDados() {
    if (finalDaLista || !lastVisible) return;

    setCarregando(true);
    try {
      const q = query(
        collection(db, "historico_megasena"),
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

  async function carregarTodosDados() {
  const todosDados = [];
  let lastVisible = null;
  try {
    while (true) {
      const q = query(
        collection(db, "historico_megasena"),
        orderBy("sorteio", "desc"),
        ...(lastVisible ? [startAfter(lastVisible)] : []),
        limit(500)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) break;

      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      todosDados.push(...novosDados);

      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
    return todosDados;
  } catch (error) {
    console.error("Erro ao carregar todos os dados:", error.message);
    return [];
  }
}

  async function baixarTodosJogos() {

  toast.info("Aguarde, estamos gerando seu arquivo...", { autoClose: 1000,
    position: "top-center"
   });

  const todosOsDados = await carregarTodosDados();

  const linhas = todosOsDados.map((jogo) => {
    return `${jogo.numeros_sorteados.join("; ")}\n`;
  });

  const conteudo = linhas.join("\n");
  const blob = new Blob([conteudo], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_megasena.txt";
  link.click();

   toast.success("Arquivo gerado com sucesso!", { autoClose: 3000,
    position: "top-center"
    });
  
}

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

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - Mega Sena</h1>

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
                        <td>SENA</td>
                        <td>{jogo.premios.v1a}</td>
                        <td>{jogo.premios.w1a}</td>
                      </tr>
                      <tr>
                        <td>QUINA</td>
                        <td>{jogo.premios.v2a}</td>
                        <td>{jogo.premios.w2a}</td>
                      </tr>
                      <tr>
                        <td>QUADRA</td>
                        <td>{jogo.premios.v3a}</td>
                        <td>{jogo.premios.w3a}</td>
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
      <div className="mt-3">
        <Link to="/app/megasenahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
      <div className="mt-3">
      <button className="btn btn-success ml-2" onClick={baixarTodosJogos}>
      <ToastContainer />
           Baixar Todos os Jogos (.txt)
        </button>
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

export default HistoricoJogoMegaSena;
