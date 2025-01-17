import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GenerateFromDataQuina.css";

const GenerateFromDataQuina = () => {
  const [inputData, setInputData] = useState("");
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

  const generateNumbersFromData = () => {
    if (!inputData.trim()) {
      toast.error("Por favor, insira uma data ou um conjunto de dados válido!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const dataNumbers = extractNumbersFromData(inputData);
    const remainingNumbers = Array.from({ length: 80 }, (_, i) => i + 1).filter(
      (num) => !dataNumbers.includes(num)
    );

    while (dataNumbers.length < 5) {
      const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
      const randomNumber = remainingNumbers[randomIndex];
      if (!dataNumbers.includes(randomNumber)) {
        dataNumbers.push(randomNumber);
      }
    }

    dataNumbers.sort((a, b) => a - b);

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

  const extractNumbersFromData = (data) => {
    const numbers = data
      .replace(/[^\d]/g, " ")
      .split(" ")
      .map((num) => parseInt(num, 10))
      .filter((num) => num >= 1 && num <= 80);
    return [...new Set(numbers)];
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-numbers-container">
      <ToastContainer />
      <h1>Gerar Números com Base em Dados - Quina</h1>

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

      <button className="generate-button" onClick={generateNumbersFromData}>
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
        <Link to="/app/quinahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GenerateFromDataQuina;
