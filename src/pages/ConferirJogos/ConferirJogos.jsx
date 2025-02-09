import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Importe a função query do PostgreSQL
import "./ConferirJogos.css";

const ConferirJogos = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await query(`
          SELECT 
              hm.*,
              COALESCE(json_agg(cm) FILTER (WHERE cm.id IS NOT NULL), '[]') AS cidades
          FROM historico_megasena hm
          LEFT JOIN cidades_megasena cm ON cm.sorteio = hm.sorteio
          GROUP BY hm.id
          ORDER BY hm.sorteio DESC
        `);
        setHistory(result.rows);
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error.message);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      const game = history.find((item) => item.sorteio === parseInt(selectedGame, 10));
      if (game) {
        setSortedNumbers((game.numeros_sorteados || []).map((n) => parseInt(n, 10)));
        setSelectedNumbers([]);
        setMatchCount(0);
      }
    }
  }, [selectedGame, history]);

  const toggleNumberSelection = (number) => {
    const num = parseInt(number, 10);
    if (selectedNumbers.includes(num)) {
      const newSelection = selectedNumbers.filter((n) => n !== num);
      setSelectedNumbers(newSelection);

      const matches = newSelection.filter((n) => sortedNumbers.includes(n));
      setMatchCount(matches.length);
    } else if (selectedNumbers.length < 6) {
      const newSelection = [...selectedNumbers, num];
      setSelectedNumbers(newSelection);

      const matches = newSelection.filter((n) => sortedNumbers.includes(n));
      setMatchCount(matches.length);
    } else {
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

      <div className="game-selection">
        <label htmlFor="game-select">Selecione o sorteio:</label>
        <select
          id="game-select"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">Selecione</option>
          {history.map((game) => (
            <option key={game.sorteio} value={game.sorteio}>
              Concurso {game.sorteio} - {game.data_do_sorteio}
            </option>
          ))}
        </select>
      </div>

      {sortedNumbers.length > 0 && (
        <div className="sorted-numbers">
          <h3>Números Sorteados:</h3>
          <div className="numbers-container">
            {sortedNumbers.map((num, idx) => (
              <div
                key={idx}
                className={`number sorted ${
                  selectedNumbers.includes(num) ? "matched" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

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