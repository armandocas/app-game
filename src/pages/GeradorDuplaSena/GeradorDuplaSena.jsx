import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GeradorDuplaSena.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeradorDuplaSena() {
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const db = getFirestore(firebaseApp);

  function selecionarNumero(numero) {
    if (numerosSelecionados.includes(numero)) {
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else {
      if (numerosSelecionados.length < 6) {
        setNumerosSelecionados([...numerosSelecionados, numero]);
      }
    }
  }

  async function adicionarJogo() {
    if (numerosSelecionados.length < 6) {
      toast.error("Por favor, selecione ao menos 6 números.", {
        position: "top-center",
      });
      return;
    }

    try {
      const jogo = {
        numeros: [...numerosSelecionados],
        data: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "duplasena"), jogo);

      toast.success("Jogo salvo com sucesso!", {
        position: "top-center",
      });

      setNumerosSelecionados([]);
    } catch (error) {
      toast.error("Erro ao salvar o jogo: " + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const numerosRestantes = 6 - numerosSelecionados.length;
    let novosNumeros = [];
    while (novosNumeros.length < numerosRestantes) {
      const numero = Math.floor(Math.random() * 50) + 1;
      if (!numerosSelecionados.includes(numero) && !novosNumeros.includes(numero)) {
        novosNumeros.push(numero);
      }
    }
    setNumerosSelecionados([...numerosSelecionados, ...novosNumeros]);
  }

  function limparVolante() {
    setNumerosSelecionados([]);
  }

  return (
    <div className="container dupla-sena-container">
      <h1>Dupla Sena - Inserir Jogo</h1>
      <p>Escolha 6 números dos 50 disponíveis. Ganhe com 6, 5, 4 ou 3 acertos.</p>
      <div className="numeros-container">
        {[...Array(50)].map((_, index) => {
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
        <Link to="/app/duplasenahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GeradorDuplaSena;
