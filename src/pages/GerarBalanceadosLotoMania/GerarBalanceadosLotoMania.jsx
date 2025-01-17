import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GerarBalanceadosLotoMania.css";

const GerarBalanceadosLotoMania = () => {
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historico_lotomania"));
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

  const generateBalancedNumbers = () => {
    const region1 = Array.from({ length: 20 }, (_, i) => i + 1);
    const region2 = Array.from({ length: 20 }, (_, i) => i + 21);
    const region3 = Array.from({ length: 20 }, (_, i) => i + 41);
    const region4 = Array.from({ length: 20 }, (_, i) => i + 61);
    const region5 = Array.from({ length: 20 }, (_, i) => i + 81);

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
      ...getRandomFromRegion(region1, 10),
      ...getRandomFromRegion(region2, 10),
      ...getRandomFromRegion(region3, 10),
      ...getRandomFromRegion(region4, 10),
      ...getRandomFromRegion(region5, 10),
    ].sort((a, b) => a - b);
  };

  const getRandomFromRegion = (region, count) => {
    const selected = [];
    while (selected.length < count) {
      const random = region[Math.floor(Math.random() * region.length)];
      if (!selected.includes(random)) selected.push(random);
    }
    return selected;
  };

  const isUnique = (numbers) => {
    return !history.some((sorteio) => arraysEqual(sorteio, numbers));
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <h1>Gerar Números Balanceados - LotoMania</h1>

      <div className="explanation">
        <h3>Como os Números São Gerados?</h3>
        <p>
          <strong>1. Distribuição por Regiões:</strong> Os números são
          escolhidos de cinco regiões diferentes:
          <ul>
            <li>
              <strong>Região 1:</strong> Números de 1 a 20
            </li>
            <li>
              <strong>Região 2:</strong> Números de 21 a 40
            </li>
            <li>
              <strong>Região 3:</strong> Números de 41 a 60
            </li>
            <li>
              <strong>Região 4:</strong> Números de 61 a 80
            </li>
            <li>
              <strong>Região 5:</strong> Números de 81 a 100
            </li>
          </ul>
          Escolhemos 10 números de cada região para criar uma distribuição
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
        <Link to="/app/lotomaniahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GerarBalanceadosLotoMania;
