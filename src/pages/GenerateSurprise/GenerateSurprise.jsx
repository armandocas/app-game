import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GenerateSurprise.css";

const GenerateSurprise = () => {
  const [displayedNumbers, setDisplayedNumbers] = useState([]); // Números exibidos gradativamente
  const [isGenerating, setIsGenerating] = useState(false); // Controle do estado de geração
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

  // Gera números completamente aleatórios
  const generateSurpriseNumbers = () => {
    setDisplayedNumbers([]);
    setIsGenerating(true);

    const numbers = [];
    while (numbers.length < 6) {
      const randomNumber = Math.floor(Math.random() * 60) + 1;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    numbers.sort((a, b) => a - b);

    // Verifica se o jogo já foi sorteado
    if (history.some((sorteio) => arraysEqual(sorteio, numbers))) {
      toast.warning("Este jogo já foi sorteado no passado. Gerando novamente...", {
        position: "top-center",
        autoClose: 3000,
      });
      generateSurpriseNumbers(); // Regenera números
      return;
    }

    // Exibe os números gradativamente
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedNumbers((prev) => [...prev, numbers[index]]);
      index++;
      if (index === numbers.length) {
        clearInterval(interval); // Encerra o intervalo após o último número ser exibido
        setTimeout(() => {
          setDisplayedNumbers(numbers); // Garante que o último número seja exibido
          setIsGenerating(false);
        }, 100); // Timeout para garantir atualização
      }
    }, 600); // Exibe um número a cada 600ms
  };

  // Função para comparar arrays
  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-surprise-container">
      <ToastContainer />
      <h1>Gerar Números em Modo Surpresa</h1>
      <p>Pressione o botão abaixo para gerar números aleatórios de forma interativa.</p>
      <p>Antes de gerar os números, o sistema verifica um histórico de sorteios já realizados para garantir que os números gerados sejam únicos e nunca se repitam.</p>

      {/* Botão de Gerar */}
      <button
        className="generate-button"
        onClick={generateSurpriseNumbers}
        disabled={isGenerating}
      >
        {isGenerating ? "Gerando..." : "Gerar Números"}
      </button>

      {/* Exibição dos Números Gerados */}
      <div className="generated-numbers">
        <h3>Números Gerados</h3>
        <div className="numbers-container">
          {displayedNumbers.map((num, idx) => (
            <div key={idx} className="number">
              {num}
            </div>
          ))}
        </div>
      </div>
    <div className="mt-3">
        <Link to="/app/megasenahome" className="btn btn-secondary">
            Voltar
        </Link>
    </div>
  </div>
  );
};

export default GenerateSurprise;
