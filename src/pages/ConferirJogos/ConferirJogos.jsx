import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ConferirJogos.css";

const ConferirJogos = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  // Carrega o histórico de sorteios
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historico_megasena"));
        const historicalGames = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historicalGames);
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error.message);
      }
    };

    fetchHistory();
  }, [db]);

  // Atualiza os números sorteados com base no jogo selecionado
  useEffect(() => {
    if (selectedGame) {
      const game = history.find((item) => item.id === selectedGame);
      if (game) {
        // Garante que sortedNumbers sejam inteiros
        setSortedNumbers((game.numeros_sorteados || []).map((n) => parseInt(n, 10)));
        setSelectedNumbers([]);
        setMatchCount(0);
      }
    }
  }, [selectedGame, history]);

  // Lida com a seleção de números
  const toggleNumberSelection = (number) => {
    const num = parseInt(number, 10); // Converte para inteiro
    if (selectedNumbers.includes(num)) {
      // Remove o número selecionado
      const newSelection = selectedNumbers.filter((n) => n !== num);
      setSelectedNumbers(newSelection);
  
      // Atualiza o contador de acertos
      const matches = newSelection.filter((n) => sortedNumbers.includes(n));
      setMatchCount(matches.length);
    } else if (selectedNumbers.length < 6) {
      // Adiciona o número, se ainda houver espaço
      const newSelection = [...selectedNumbers, num];
      setSelectedNumbers(newSelection);
  
      // Atualiza o contador de acertos
      const matches = newSelection.filter((n) => sortedNumbers.includes(n));
      setMatchCount(matches.length);
    } else {
      // Exibe um aviso se o limite for atingido
      toast.error("Você só pode selecionar 6 números!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  

  return (
    <div className="conferir-jogos-container">
      <ToastContainer />
      <h1>Conferir Jogos da Mega Sena</h1>

      {/* Seleção do Jogo */}
      <div className="game-selection">
        <label htmlFor="game-select">Selecione o sorteio:</label>
        <select
          id="game-select"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">Selecione</option>
          {history.map((game) => (
            <option key={game.id} value={game.id}>
              Concurso {game.id} - {game.data_do_sorteio}
            </option>
          ))}
        </select>
      </div>

      {/* Exibição dos Números Sorteados */}
      {sortedNumbers.length > 0 && (
        <div className="sorted-numbers">
          <h3>Números Sorteados:</h3>
          <div className="numbers-container">
            {sortedNumbers.map((num, idx) => (
              <div key={idx} className="number sorted">
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade de Seleção de Números */}
      <div className="user-selection">
        <h3>Selecione seus números:</h3>
        <div className="numbers-grid">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className={`number ${
                selectedNumbers.includes(num) ? "selected" : ""
              }`}
              onClick={() => toggleNumberSelection(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Contador de Acertos */}
      <div className="result-container">
        <h3>Resultado:</h3>
        <p>Números Acertados: {matchCount}</p>
      </div>
        <div className="mb-3">
            <Link to="/app/megasenahome" className="btn btn-secondary">
                Voltar
            </Link>
        </div>
    </div>
  );
};

export default ConferirJogos;
