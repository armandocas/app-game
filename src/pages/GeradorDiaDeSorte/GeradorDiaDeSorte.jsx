import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GeradorDiaDeSorte.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeradorDiaDeSorte() {
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [mesDaSorte, setMesDaSorte] = useState(""); // Mês da Sorte
  const db = getFirestore(firebaseApp);

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  function selecionarNumero(numero) {
    if (numerosSelecionados.includes(numero)) {
      // Remove o número se já estiver selecionado
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else {
      // Adiciona o número se não estiver selecionado (máximo de 7 números)
      if (numerosSelecionados.length < 7) {
        setNumerosSelecionados([...numerosSelecionados, numero]);
      }
    }
  }

  async function adicionarJogo() {
    if (numerosSelecionados.length < 7) {
      toast.error("Por favor, selecione ao menos 7 números.", {
        position: "top-center",
      });
      return;
    }

    if (!mesDaSorte) {
      toast.error("Por favor, escolha um Mês da Sorte.", {
        position: "top-center",
      });
      return;
    }

    try {
      const jogo = {
        numeros: [...numerosSelecionados],
        mes: mesDaSorte,
        data: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "diadesorte"), jogo);

      toast.success("Jogo salvo com sucesso!", {
        position: "top-center",
      });

      setNumerosSelecionados([]);
      setMesDaSorte("");
    } catch (error) {
      toast.error("Erro ao salvar o jogo: " + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const numerosRestantes = 7 - numerosSelecionados.length;
    let novosNumeros = [];
    while (novosNumeros.length < numerosRestantes) {
      const numero = Math.floor(Math.random() * 31) + 1;
      if (!numerosSelecionados.includes(numero) && !novosNumeros.includes(numero)) {
        novosNumeros.push(numero);
      }
    }
    setNumerosSelecionados([...numerosSelecionados, ...novosNumeros]);
  }

  function limparVolante() {
    setNumerosSelecionados([]);
    setMesDaSorte("");
  }

  return (
    <div className="container dia-de-sorte-container">
      <h1>Dia de Sorte - Inserir Jogo</h1>
      <p>Escolha 7 números dos 31 disponíveis e selecione seu Mês da Sorte.</p>

      <div className="numeros-container">
        {[...Array(31)].map((_, index) => {
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

      <div className="mes-da-sorte">
        <label htmlFor="mes">Escolha seu Mês da Sorte:</label>
        <select
          id="mes"
          value={mesDaSorte}
          onChange={(e) => setMesDaSorte(e.target.value)}
        >
          <option value="">Selecione um mês</option>
          {meses.map((mes, idx) => (
            <option key={idx} value={mes}>
              {mes}
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
        <Link to="/app/dia-de-sorte-home" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GeradorDiaDeSorte;
