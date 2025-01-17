import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GerarBalanceadosQuina.css";

const GerarBalanceadosQuina = () => {
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historico_quina"));
        const historicalNumbers = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return Array.isArray(data.numeros_sorteados)
              ? data.numeros_sorteados.map(Number)
              : null;
          })
          .filter((sorteio) => sorteio !== null);
        setHistory(historicalNumbers);
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error.message);
      }
    };

    fetchHistory();
  }, [db]);

  const getRandomFromRegion = (region, count) => {
    const selected = [];
    while (selected.length < count) {
      const random = region[Math.floor(Math.random() * region.length)];
      if (!selected.includes(random)) selected.push(random);
    }
    return selected;
  };

  const generateBalancedNumbers = () => {
    const region1 = Array.from({ length: 16 }, (_, i) => i + 1);
    const region2 = Array.from({ length: 16 }, (_, i) => i + 17);
    const region3 = Array.from({ length: 16 }, (_, i) => i + 33);
    const region4 = Array.from({ length: 16 }, (_, i) => i + 49);
    const region5 = Array.from({ length: 16 }, (_, i) => i + 65);

    let selectedNumbers;

    do {
      selectedNumbers = generateUniqueNumbers(
        region1,
        region2,
        region3,
        region4,
        region5
      );
    } while (!isUnique(selectedNumbers));

    setGeneratedNumbers(selectedNumbers);
  };

  const generateUniqueNumbers = (region1, region2, region3, region4, region5) => {
    return [
      ...getRandomFromRegion(region1, 1),
      ...getRandomFromRegion(region2, 1),
      ...getRandomFromRegion(region3, 1),
      ...getRandomFromRegion(region4, 1),
      ...getRandomFromRegion(region5, 1),
    ].sort((a, b) => a - b);
  };

  const isUnique = (numbers) => {
    return !history.some((sorteio) => arraysEqual(sorteio, numbers));
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <h1>Gerar Números Balanceados - Quina</h1>

      <div className="explanation">
        <h3>Como os Números São Gerados?</h3>
        <p>
          <strong>1. Distribuição por Regiões:</strong> Os números são
          escolhidos de cinco regiões diferentes:
          <ul>
            <li>
              <strong>Região 1:</strong> Números de 1 a 16
            </li>
            <li>
              <strong>Região 2:</strong> Números de 17 a 32
            </li>
            <li>
              <strong>Região 3:</strong> Números de 33 a 48
            </li>
            <li>
              <strong>Região 4:</strong> Números de 49 a 64
            </li>
            <li>
              <strong>Região 5:</strong> Números de 65 a 80
            </li>
          </ul>
          Escolhemos 1 número de cada região para criar uma distribuição
          equilibrada.
        </p>
        <p>
          <strong>2. Números Exclusivos:</strong> Garantimos que o jogo gerado
          não seja igual a nenhum jogo anterior do nosso histórico de sorteios.
        </p>
        <p>
          <strong>3. Ordem Crescente:</strong> Após selecionarmos os números,
          eles são ordenados para facilitar a leitura.
        </p>
      </div>

      <button className="generate-button" onClick={generateBalancedNumbers}>
        Gerar Números Balanceados
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
        <Link to="/app/quinahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GerarBalanceadosQuina;
