import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GenerateFavoritoLotoMania.css";

const GenerateFavoritoLotoMania = () => {
  const [favorites, setFavorites] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchHistory = async () => {
      const querySnapshot = await getDocs(collection(db, "historico_lotomania"));
      const historicalNumbers = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.numeros_sorteados.map(Number);
      });
      setHistory(historicalNumbers);
    };

    fetchHistory();
  }, [db]);

  const generateNumbers = () => {
    const availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1)
      .filter((num) => !favorites.includes(num))
      .filter((num) => !exclusions.includes(num));

    const newNumbers = [];

    favorites.forEach((num) => {
      if (!newNumbers.includes(num)) {
        newNumbers.push(num);
      }
    });

    while (newNumbers.length < 50) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNumber = availableNumbers[randomIndex];

      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }

    newNumbers.sort((a, b) => a - b);

    if (history.some((sorteio) => arraysEqual(sorteio, newNumbers))) {
      alert("Este jogo já foi sorteado no passado. Gerando novamente...");
      generateNumbers();
      return;
    }

    setGeneratedNumbers(newNumbers);
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <h1>Gerar Números LotoMania com Preferências</h1>

      <div>
        <h3>Números Favoritos</h3>
        <input
          type="text"
          placeholder="Ex: 5, 12, 15"
          onChange={(e) =>
            setFavorites(
              e.target.value
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => num >= 1 && num <= 100)
            )
          }
        />
        <p className="info">
          Insira os números favoritos separados por vírgulas. Ex: 5, 12, 15
        </p>
      </div>

      <div>
        <h3>Números a Excluir</h3>
        <input
          type="text"
          placeholder="Ex: 8, 20, 25"
          onChange={(e) =>
            setExclusions(
              e.target.value
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => num >= 1 && num <= 100)
            )
          }
        />
        <p className="info">
          Insira os números a serem excluídos separados por vírgulas. Ex: 8, 20, 25
        </p>
      </div>

      <button className="generate-button" onClick={generateNumbers}>
        Gerar Números
      </button>

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
        <Link to="/app/lotomaniahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GenerateFavoritoLotoMania;
