import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GeradorMilionaria.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeradorMilionaria() {
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [trevosSelecionados, setTrevosSelecionados] = useState([]);
  const db = getFirestore(firebaseApp);

  // Seleção de números principais
  function selecionarNumero(numero) {
    if (numerosSelecionados.includes(numero)) {
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else {
      if (numerosSelecionados.length < 6) {
        setNumerosSelecionados([...numerosSelecionados, numero]);
      }
    }
  }

  // Seleção dos trevos da sorte
  function selecionarTrevo(numero) {
    if (trevosSelecionados.includes(numero)) {
      setTrevosSelecionados(trevosSelecionados.filter((n) => n !== numero));
    } else {
      if (trevosSelecionados.length < 2) {
        setTrevosSelecionados([...trevosSelecionados, numero]);
      }
    }
  }

  async function adicionarJogo() {
    if (numerosSelecionados.length < 6 || trevosSelecionados.length < 2) {
      toast.error("Por favor, selecione 6 números e 2 trevos da sorte.", {
        position: "top-center",
      });
      return;
    }

    try {
      const jogo = {
        numeros: [...numerosSelecionados],
        trevos: [...trevosSelecionados],
        data: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "mais_milionaria"), jogo);

      toast.success("Jogo salvo com sucesso!", {
        position: "top-center",
      });

      setNumerosSelecionados([]);
      setTrevosSelecionados([]);
    } catch (error) {
      toast.error("Erro ao salvar o jogo: " + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const numerosRestantes = 6 - numerosSelecionados.length;
    const trevosRestantes = 2 - trevosSelecionados.length;

    const novosNumeros = [];
    while (novosNumeros.length < numerosRestantes) {
      const numero = Math.floor(Math.random() * 50) + 1;
      if (!numerosSelecionados.includes(numero) && !novosNumeros.includes(numero)) {
        novosNumeros.push(numero);
      }
    }

    const novosTrevos = [];
    while (novosTrevos.length < trevosRestantes) {
      const numero = Math.floor(Math.random() * 6) + 1;
      if (!trevosSelecionados.includes(numero) && !novosTrevos.includes(numero)) {
        novosTrevos.push(numero);
      }
    }

    setNumerosSelecionados([...numerosSelecionados, ...novosNumeros]);
    setTrevosSelecionados([...trevosSelecionados, ...novosTrevos]);
  }

  function limparVolante() {
    setNumerosSelecionados([]);
    setTrevosSelecionados([]);
  }

  return (
    <div className="container mais-milionaria-container">
      <h1>+Milionária - Inserir Jogo</h1>
      <p>Escolha 6 números de 1 a 50 e 2 "trevos da sorte" de 1 a 6.</p>

      {/* Números principais */}
      <div className="numeros-container">
        <h2>Números (1 a 50)</h2>
        {[...Array(50)].map((_, index) => {
          const numero = index + 1;
          return (
            <div
              key={numero}
              className={`numero ${
                numerosSelecionados.includes(numero) ? "selecionado" : ""
              }`}
              onClick={() => selecionarNumero(numero)}
            >
              {String(numero).padStart(2, "0")}
            </div>
          );
        })}
      </div>

      {/* Trevos da sorte */}
      <div className="trevos-container">
        <h2>Trevos da Sorte (1 a 6)</h2>
        {[...Array(6)].map((_, index) => {
          const numero = index + 1;
          return (
            <div
              key={numero}
              className={`trevo ${
                trevosSelecionados.includes(numero) ? "selecionado" : ""
              }`}
              onClick={() => selecionarTrevo(numero)}
            >
              {numero}
            </div>
          );
        })}
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
        <Link to="/app/milionariahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GeradorMilionaria;
