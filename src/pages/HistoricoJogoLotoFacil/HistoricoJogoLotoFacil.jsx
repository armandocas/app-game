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
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  // Função para carregar mais dados
  async function carregarMaisDados() {
    if (finalDaLista || !lastVisible) return;

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

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFinalDaLista(querySnapshot.empty);
    } catch (error) {
      console.error("Erro ao carregar mais dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  // Função para carregar todos os dados da base
  async function carregarTodosDados() {
  const todosDados = [];
  let lastVisible = null; // Variável para paginação manual
  try {
    while (true) {
      const q = query(
        collection(db, "historico_lotofacil"),
        orderBy("sorteio", "desc"),
        ...(lastVisible ? [startAfter(lastVisible)] : []), // Continua de onde parou
        limit(500) // Limite de 500 por requisição (limite do Firestore)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) break; // Sai do loop se não houver mais documentos

      const novosDados = querySnapshot.docs.map((doc) => doc.data());
      todosDados.push(...novosDados);

      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Atualiza último documento visível
    }
    return todosDados;
  } catch (error) {
    console.error("Erro ao carregar todos os dados:", error.message);
    return [];
  }
}


// Função para baixar todos os dados em um arquivo .txt
  async function baixarTodosJogos() {

     // Exibe o Toast de carregamento
  toast.info("Aguarde, estamos gerando seu arquivo...", { autoClose: 1000 });

  const todosOsDados = await carregarTodosDados();

  const linhas = todosOsDados.map((jogo) => {
    return `${jogo.numeros_sorteados.join("; ")}\n`;
  });

  const conteudo = linhas.join("\n"); // Junta tudo
  const blob = new Blob([conteudo], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_lotofacil.txt";
  link.click();

   // Exibe o Toast de sucesso
   toast.success("Arquivo gerado com sucesso!", { autoClose: 3000 });
  
}

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
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>{jogo.premios.v1a}</td>
                <td>
                  {jogo.cidades.length > 0
                    ? jogo.cidades.map((cidade, idx) => (
                        <div key={idx}>
                          {cidade.cidade} - {cidade.estado}
                        </div>
                      ))
                    : "ACUMULOU"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/lotofacilhome" className="btn btn-secondary">
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

export default HistoricoJogoLotoFacil;
