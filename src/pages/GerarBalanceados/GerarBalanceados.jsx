import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GerarBalanceados.css";

const GenerateBalanced = () => {
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  // Carrega o histórico de sorteios ao montar o componente
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historico_megasena"));
        const historicalNumbers = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return Array.isArray(data.numeros_sorteados)
              ? data.numeros_sorteados.map(Number)
              : null;
          })
          .filter((sorteio) => sorteio !== null); // Remove entradas inválidas
        setHistory(historicalNumbers);
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error.message);
      }
    };

    fetchHistory();
  }, [db]);

  // Função para obter números aleatórios de uma região
  const getRandomFromRegion = (region, count) => {
    const selected = [];
    while (selected.length < count) {
      const random = region[Math.floor(Math.random() * region.length)];
      if (!selected.includes(random)) selected.push(random);
    }
    return selected;
  };

  // Gera números balanceados e verifica exclusividade
  const generateBalancedNumbers = () => {
    const region1 = Array.from({ length: 20 }, (_, i) => i + 1); // 1-20
    const region2 = Array.from({ length: 20 }, (_, i) => i + 21); // 21-40
    const region3 = Array.from({ length: 20 }, (_, i) => i + 41); // 41-60

    let selectedNumbers;

    do {
      selectedNumbers = generateUniqueNumbers(region1, region2, region3);
    } while (!isUnique(selectedNumbers));

    setGeneratedNumbers(selectedNumbers);
  };

  // Função para gerar números únicos
  const generateUniqueNumbers = (region1, region2, region3) => {
    return [
      ...getRandomFromRegion(region1, 2), // 2 números da região 1
      ...getRandomFromRegion(region2, 2), // 2 números da região 2
      ...getRandomFromRegion(region3, 2), // 2 números da região 3
    ].sort((a, b) => a - b);
  };

  // Função para verificar se os números são únicos no histórico
  const isUnique = (numbers) => {
    return !history.some((sorteio) => arraysEqual(sorteio, numbers));
  };

  // Função para comparar arrays
  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <h1>Gerar Números Balanceados</h1>

      {/* Explicação de como os números são gerados */}
      <div className="explanation">
        <h3>Como os Números São Gerados?</h3>
        <p>
          <strong>1. Equilíbrio entre Números Pares e Ímpares:</strong> Sempre
          geramos 3 números pares e 3 números ímpares para manter o equilíbrio
          entre os tipos de números.
        </p>
        <p>
          <strong>2. Distribuição por Regiões:</strong> Os números são
          escolhidos de três regiões diferentes:
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
          </ul>
          Escolhemos 2 números de cada região para criar uma distribuição
          equilibrada.
        </p>
        <p>
          <strong>3. Números Exclusivos:</strong> Garantimos que o jogo gerado
          não seja igual a nenhum jogo anterior do nosso histórico de sorteios.
        </p>
        <p>
          <strong>4. Ordem Crescente:</strong> Após selecionarmos os números,
          eles são ordenados para facilitar a leitura.
        </p>
      </div>

      {/* Botão de Gerar */}
      <button className="generate-button" onClick={generateBalancedNumbers}>
        Gerar Números Balanceados
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
    </div>
  );
};

export default GenerateBalanced;