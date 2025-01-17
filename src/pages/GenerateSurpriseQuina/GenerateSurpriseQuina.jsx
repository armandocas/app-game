import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GenerateSurpriseQuina.css";

const GenerateSurpriseQuina = () => {
  const [displayedNumbers, setDisplayedNumbers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const generateSurpriseNumbers = () => {
    setDisplayedNumbers([]);
    setIsGenerating(true);

    const numbers = [];
    while (numbers.length < 5) {
      const randomNumber = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    numbers.sort((a, b) => a - b);

    if (history.some((sorteio) => arraysEqual(sorteio, numbers))) {
      toast.warning("Este jogo já foi sorteado no passado. Gerando novamente...", {
        position: "top-center",
        autoClose: 3000,
      });
      generateSurpriseNumbers();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedNumbers((prev) => [...prev, numbers[index]]);
      index++;
      if (index === numbers.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayedNumbers(numbers);
          setIsGenerating(false);
        }, 100);
      }
    }, 600);
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="generate-surprise-container">
      <ToastContainer />
      <h1>Gerar Números em Modo Surpresa - Quina</h1>
      <p>Pressione o botão abaixo para gerar números aleatórios de forma interativa.</p>
      <p>Antes de gerar os números, o sistema verifica um histórico de sorteios já realizados para garantir que os números gerados sejam únicos e nunca se repitam.</p>

      <button
        className="generate-button"
        onClick={generateSurpriseNumbers}
        disabled={isGenerating}
      >
        {isGenerating ? "Gerando..." : "Gerar Números"}
      </button>

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
        <Link to="/app/quinahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GenerateSurpriseQuina;
