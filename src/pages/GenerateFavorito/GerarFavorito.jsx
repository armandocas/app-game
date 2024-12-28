import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GenerateFavorito.css";

const GenerateFavorito = () => {
  const [favorites, setFavorites] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  // Carrega o histórico de sorteios ao montar o componente
  useEffect(() => {
    const fetchHistory = async () => {
      const querySnapshot = await getDocs(collection(db, "historico_megasena"));
      const historicalNumbers = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.numeros_sorteados.map(Number); // Converte os números para inteiros
      });
      setHistory(historicalNumbers);
    };

    fetchHistory();
  }, [db]);

  // Gera os números com base nos favoritos e exclusões
  const generateNumbers = () => {
    const availableNumbers = Array.from({ length: 60 }, (_, i) => i + 1)
      .filter((num) => !favorites.includes(num)) // Remove os favoritos para reincluir manualmente
      .filter((num) => !exclusions.includes(num)); // Remove números excluídos

    const newNumbers = [];

    // Inclui os favoritos no sorteio
    favorites.forEach((num) => {
      if (!newNumbers.includes(num)) {
        newNumbers.push(num);
      }
    });

    // Completa com números aleatórios sem repetir
    while (newNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNumber = availableNumbers[randomIndex];

      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }

    newNumbers.sort((a, b) => a - b); // Ordena os números gerados

    // Verifica se o jogo já foi sorteado
    if (history.some((sorteio) => arraysEqual(sorteio, newNumbers))) {
      alert("Este jogo já foi sorteado no passado. Gerando novamente...");
      generateNumbers();
      return;
    }

    setGeneratedNumbers(newNumbers);
  };

  // Função para comparar arrays
  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <h1>Gerar Números com Preferências</h1>

      {/* Números Favoritos */}
      <div>
        <h3>Números Favoritos</h3>
        <input
          type="text"
          placeholder="Ex: 5, 12, 25"
          onChange={(e) =>
            setFavorites(
              e.target.value
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => num >= 1 && num <= 60)
            )
          }
        />
        <p className="info">
          Insira os números favoritos separados por vírgulas. Ex: 5, 12, 25
        </p>
      </div>

      {/* Números a Excluir */}
      <div>
        <h3>Números a Excluir</h3>
        <input
          type="text"
          placeholder="Ex: 8, 30, 45"
          onChange={(e) =>
            setExclusions(
              e.target.value
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => num >= 1 && num <= 60)
            )
          }
        />
        <p className="info">
          Insira os números a serem excluídos separados por vírgulas. Ex: 8, 30, 45
        </p>
      </div>

      {/* Botão de Gerar */}
      <button className="generate-button" onClick={generateNumbers}>
        Gerar Números
      </button>

      {/* Exibição dos Números Gerados */}
      {generatedNumbers.length > 0 && (
        <div className="generated-numbers">
          <h3>Números Gerados</h3>
          <div className="numbers-container">
            {generatedNumbers.map((num, idx) => (
              <div key={idx} className="number">
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
            <div className="mt-3">
              <Link to="/app/megasenahome" className="btn btn-secondary">
                Voltar
              </Link>
            </div>
    </div>
  );
};

export default GenerateFavorito;
