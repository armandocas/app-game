import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GenerateZodiac.css";

const zodiacNumbersMap = {
    áries: [1, 9, 18, 27],
    touro: [2, 8, 15, 22],
    gêmeos: [3, 12, 21, 30],
    câncer: [4, 10, 19, 28],
    leão: [5, 14, 23, 32],
    virgem: [6, 11, 20, 29],
    libra: [7, 13, 24, 31],
    escorpião: [8, 16, 25, 34],
    sagitário: [9, 17, 26, 35],
    capricórnio: [10, 18, 27, 36],
    aquário: [11, 19, 28, 37],
    peixes: [12, 20, 29, 38],
  };
  

const GenerateZodiac = () => {
  const [selectedSign, setSelectedSign] = useState(""); // Signo selecionado pelo usuário
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

  // Gera números com base no signo
  const generateNumbersByZodiac = () => {
    if (!selectedSign) {
      toast.error("Por favor, selecione um signo do zodíaco!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    let baseNumbers = zodiacNumbersMap[selectedSign] || [];
    const remainingNumbers = Array.from({ length: 60 }, (_, i) => i + 1).filter(
      (num) => !baseNumbers.includes(num)
    );

    // Preenche com números aleatórios para garantir 6 números únicos
    while (baseNumbers.length < 6) {
      const randomNum = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
      if (!baseNumbers.includes(randomNum)) {
        baseNumbers.push(randomNum);
      }
    }

    baseNumbers.sort((a, b) => a - b);

    // Verifica se o jogo já foi sorteado
    if (history.some((sorteio) => arraysEqual(sorteio, baseNumbers))) {
      toast.warning("Este jogo já foi sorteado no passado. Gerando novamente...", {
        position: "top-center",
        autoClose: 3000,
      });
      generateNumbersByZodiac();
      return;
    }

    setGeneratedNumbers(baseNumbers);
  };

  // Função para comparar arrays
  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
         <div className="generate-zodiac-container">
             <ToastContainer />
            <h1>Gerar Números com Base no Zodíaco</h1>
               <p>Escolha seu signo e descubra números personalizados com base na astrologia.</p>

         <div className="zodiac-selection">
            <label htmlFor="zodiac-sign">Selecione seu signo: </label>
          <select
            id="zodiac-sign"
            value={selectedSign}
            onChange={(e) => setSelectedSign(e.target.value)}
          >
            <option value="">Selecione um signo</option>
               {Object.keys(zodiacNumbersMap).map((sign) => (
                <option key={sign} value={sign}>
                  {sign.charAt(0).toUpperCase() + sign.slice(1)}
            </option>
          ))}
        </select>
      </div>

       <button className="generate-button" onClick={generateNumbersByZodiac}>
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
        <Link to="/app/megasenahome" className="btn btn-secondary">
            Voltar
        </Link>
    </div>
</div>

  );
};

export default GenerateZodiac;
