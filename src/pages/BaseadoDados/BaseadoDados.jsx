import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BaseadoDados.css";

const GenerateFromData = () => {
  const [inputData, setInputData] = useState(""); // Entrada do usuário
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

  // Gera os números com base nos dados fornecidos
  const generateNumbersFromData = () => {
    if (!inputData.trim()) {
      toast.error("Por favor, insira uma data ou um conjunto de dados válido!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const dataNumbers = extractNumbersFromData(inputData); // Extrai números da entrada
    const remainingNumbers = Array.from({ length: 60 }, (_, i) => i + 1).filter(
      (num) => !dataNumbers.includes(num)
    );

    // Preenche os números restantes de forma aleatória
    while (dataNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
      const randomNumber = remainingNumbers[randomIndex];
      if (!dataNumbers.includes(randomNumber)) {
        dataNumbers.push(randomNumber);
      }
    }

    dataNumbers.sort((a, b) => a - b); // Ordena os números

    // Verifica se o jogo já foi sorteado
    if (history.some((sorteio) => arraysEqual(sorteio, dataNumbers))) {
      toast.warning("Este jogo já foi sorteado no passado. Gerando novamente...", {
        position: "top-center",
        autoClose: 3000,
      });
      generateNumbersFromData();
      return;
    }

    setGeneratedNumbers(dataNumbers);
  };

  // Extrai números da entrada de dados (exemplo: data "25/12/2023")
  const extractNumbersFromData = (data) => {
    const numbers = data
      .replace(/[^\d]/g, " ") // Remove caracteres não numéricos
      .split(" ") // Divide os números
      .map((num) => parseInt(num, 10))
      .filter((num) => num >= 1 && num <= 60); // Filtra números válidos
    return [...new Set(numbers)]; // Remove duplicatas
  };

  // Função para comparar arrays
  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <ToastContainer />
      <h1>Gerar Números com Base em Dados</h1>

      {/* Entrada de Dados */}
      <div>
        <h3>Insira uma Data ou Dados Especiais</h3>
        <input
          type="text"
          placeholder="Ex: 25/12/2023 ou números separados por vírgula"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <p className="info">
          Insira uma data (ex: 25/12/2023) ou outros números especiais separados por vírgulas. Números inválidos serão ignorados.
        </p>
      </div>

      {/* Botão de Gerar */}
      <button className="generate-button" onClick={generateNumbersFromData}>
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
    </div>
  );
};

export default GenerateFromData;
