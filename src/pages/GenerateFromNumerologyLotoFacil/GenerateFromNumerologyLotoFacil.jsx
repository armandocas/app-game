import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GenerateFromNumerologiaLotoFacil.css";

const GenerateFromNumerologyLotoFacil = () => {
  const [inputName, setInputName] = useState(""); 
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historico_lotofacil"));
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

  const generateNumbersFromName = () => {
    if (!inputName.trim()) {
      toast.error("Por favor, insira um nome ou dado válido para a numerologia!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const numerologyNumbers = convertNameToNumerology(inputName);
    const uniqueNumbers = Array.from(new Set(numerologyNumbers));

    while (uniqueNumbers.length < 15) {
      const randomNum = Math.floor(Math.random() * 25) + 1;
      if (!uniqueNumbers.includes(randomNum)) {
        uniqueNumbers.push(randomNum);
      }
    }

    uniqueNumbers.sort((a, b) => a - b);

    if (history.some((sorteio) => arraysEqual(sorteio, uniqueNumbers))) {
      toast.warning("Este jogo já foi sorteado no passado. Gerando novamente...", {
        position: "top-center",
        autoClose: 3000,
      });
      generateNumbersFromName();
      return;
    }

    setGeneratedNumbers(uniqueNumbers.slice(0, 15));
  };

  const convertNameToNumerology = (name) => {
    const numerologyTable = {
      a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
      j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
      s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
    };

    return name
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .split("")
      .map((char) => numerologyTable[char])
      .filter((num) => num >= 1 && num <= 25);
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);

  };
  const clearFields = () => {
    setInputName("");
    setGeneratedNumbers([]);
  };

  return (
    <div className="generate-numbers-container">
      <ToastContainer />
      <h1>Gerar Números com Base em Numerologia</h1>

      <div>
        <h3>Insira um Nome ou Dados Especiais</h3>
        <input
          type="text"
          placeholder="Ex: Maria Silva ou dados específicos"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <p className="info">
          Insira um nome ou dados especiais para gerar números usando numerologia. 
          Nomes/dados são convertidos para números de 1 a 25.
        </p>
      </div>

      <button className="generate-button" onClick={generateNumbersFromName}>
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
        <button className="btn btn-danger" onClick={clearFields}>
          Limpar
        </button>
      </div>
      <div className="mt-3">
        <Link to="/app/lotofacilhome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default GenerateFromNumerologyLotoFacil;
