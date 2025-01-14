import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./GeradorSuperSete.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeradorSuperSete() {
  const [numerosSelecionados, setNumerosSelecionados] = useState(
    Array(7).fill(null)
  );
  const db = getFirestore(firebaseApp);

  function selecionarNumero(coluna, numero) {
    const novosNumeros = [...numerosSelecionados];
    novosNumeros[coluna] = numero;
    setNumerosSelecionados(novosNumeros);
  }

  async function adicionarJogo() {
    if (numerosSelecionados.includes(null)) {
      toast.error("Por favor, selecione um número em cada coluna.", {
        position: "top-center",
      });
      return;
    }

    try {
      const jogo = {
        numeros: [...numerosSelecionados],
        data: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "supersete"), jogo);

      toast.success("Jogo salvo com sucesso!", {
        position: "top-center",
      });

      setNumerosSelecionados(Array(7).fill(null));
    } catch (error) {
      toast.error("Erro ao salvar o jogo: " + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const novosNumeros = numerosSelecionados.map((numero) =>
      numero === null ? Math.floor(Math.random() * 10) : numero
    );
    setNumerosSelecionados(novosNumeros);
  }

  function limparVolante() {
    setNumerosSelecionados(Array(7).fill(null));
  }

  return (
    <div className="container super-sete-container">
      <h1>Super Sete - Inserir Jogo</h1>
      <p>Escolha 1 número de 0 a 9 para cada uma das 7 colunas.</p>

      <div className="colunas-container">
        {[...Array(7)].map((_, coluna) => (
          <div key={coluna} className="coluna">
            <h3>Coluna {coluna + 1}</h3>
            <div className="numeros-container">
              {[...Array(10)].map((_, numero) => (
                <div
                  key={numero}
                  className={`numero ${
                    numerosSelecionados[coluna] === numero ? "selecionado" : ""
                  }`}
                  onClick={() => selecionarNumero(coluna, numero)}
                >
                  {numero}
                </div>
              ))}
            </div>
          </div>
        ))}
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
        <Link to="/app/supersetehome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GeradorSuperSete;
