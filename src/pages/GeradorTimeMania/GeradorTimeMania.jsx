import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GeradorTimeMania.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeradorTimeMania() {
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [timeDoCoracao, setTimeDoCoracao] = useState(""); // Time do Coração
  const db = getFirestore(firebaseApp);

  const times = [
    "Corinthians", "Flamengo", "São Paulo", "Palmeiras", "Vasco", 
    "Grêmio", "Cruzeiro", "Atlético-MG", "Internacional", "Santos",
    // Adicionar mais times conforme necessário...
  ];

  function selecionarNumero(numero) {
    if (numerosSelecionados.includes(numero)) {
      // Remove o número se já estiver selecionado
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else {
      // Adiciona o número se não estiver selecionado (máximo de 10 números)
      if (numerosSelecionados.length < 10) {
        setNumerosSelecionados([...numerosSelecionados, numero]);
      }
    }
  }

  async function adicionarJogo() {
    if (numerosSelecionados.length < 10) {
      toast.error("Por favor, selecione ao menos 10 números.", {
        position: "top-center",
      });
      return;
    }

    if (!timeDoCoracao) {
      toast.error("Por favor, escolha um Time do Coração.", {
        position: "top-center",
      });
      return;
    }

    try {
      const jogo = {
        numeros: [...numerosSelecionados],
        time: timeDoCoracao,
        data: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "timemania"), jogo);

      toast.success("Jogo salvo com sucesso!", {
        position: "top-center",
      });

      setNumerosSelecionados([]);
      setTimeDoCoracao("");
    } catch (error) {
      toast.error("Erro ao salvar o jogo: " + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const numerosRestantes = 10 - numerosSelecionados.length;
    let novosNumeros = [];
    while (novosNumeros.length < numerosRestantes) {
      const numero = Math.floor(Math.random() * 80) + 1;
      if (!numerosSelecionados.includes(numero) && !novosNumeros.includes(numero)) {
        novosNumeros.push(numero);
      }
    }
    setNumerosSelecionados([...numerosSelecionados, ...novosNumeros]);
  }

  function limparVolante() {
    setNumerosSelecionados([]);
    setTimeDoCoracao("");
  }

  return (
    <div className="container timemania-container">
      <h1>Timemania - Inserir Jogo</h1>
      <p>Escolha 10 números dos 80 disponíveis e selecione seu Time do Coração.</p>

      <div className="numeros-container">
        {[...Array(80)].map((_, index) => {
          const numero = index + 1;
          return (
            <div
              key={numero}
              className={`numero ${numerosSelecionados.includes(numero) ? "selecionado" : ""}`}
              onClick={() => selecionarNumero(numero)}
            >
              {String(numero).padStart(2, "0")}
            </div>
          );
        })}
      </div>

      <div className="selecionados">
        <p>Números Selecionados: {numerosSelecionados.join(", ")}</p>
      </div>

      <div className="time-do-coracao">
        <label htmlFor="time">Escolha seu Time do Coração:</label>
        <select
          id="time"
          value={timeDoCoracao}
          onChange={(e) => setTimeDoCoracao(e.target.value)}
        >
          <option value="">Selecione um time</option>
          {times.map((time, idx) => (
            <option key={idx} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="botoes-container">
        <button className="btn btn-primary" onClick={completarJogo}>
          Gerar Jogo
        </button>
        <button className="btn btn-secondary" onClick={limparVolante}>
          Limpar Volante
        </button>
      </div>

      <button className="btn btn-success mt-3" onClick={adicionarJogo}>
        Salvar Jogo
      </button>

      <div className="mt-3">
        <Link to="/app/timemaniahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GeradorTimeMania;
