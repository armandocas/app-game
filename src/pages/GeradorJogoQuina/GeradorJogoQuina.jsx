import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../../Config/firebase';
import './GeradorJogoQuina.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Quina() {
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function selecionarNumero(numero) {
    if (numerosSelecionados.includes(numero)) {
      // Remove o número se já estiver selecionado
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else {
      // Adiciona o número se não estiver selecionado (máximo de 5 números)
      if (numerosSelecionados.length < 5) {
        setNumerosSelecionados([...numerosSelecionados, numero]);
      }
    }
  }

  async function adicionarJogo() {
    if (numerosSelecionados.length < 5) {
      toast.error('Por favor, selecione ao menos 5 números.', {
        position: "top-center",
      });
      return;
    }
  
    try {
      const jogo = {
        numeros: [...numerosSelecionados], // Garante que `numeros` seja um array de números
        data: new Date().toLocaleString(), // Data em string
      };
  
      console.log("Dados do jogo que serão enviados:", jogo);
  
      await addDoc(collection(db, "quina"), jogo);
      
      toast.success('Jogo salvo com sucesso!', {
        position: "top-center",
      });
      
      setNumerosSelecionados([]);
    } catch (error) {
      toast.error('Erro ao salvar o jogo: ' + error.message, {
        position: "top-center",
      });
      console.error("Erro ao salvar o jogo:", error);
    }
  }

  function completarJogo() {
    const numerosRestantes = 5 - numerosSelecionados.length;
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
  }

  return (
    <div className="container quina-container">
      <h1>Quina - Inserir Jogo</h1>
      <p>Escolha 5 números dos 80 disponíveis. Ganhe com 5, 4, 3 ou 2 acertos.</p>
      <div className="numeros-container">
        {[...Array(80)].map((_, index) => {
          const numero = index + 1;
          return (
            <div
              key={numero}
              className={`numero ${numerosSelecionados.includes(numero) ? 'selecionado' : ''}`}
              onClick={() => selecionarNumero(numero)}
            >
              {String(numero).padStart(2, '0')}
            </div>
          );
        })}
      </div>

      <div className="selecionados">
        <p>Números Selecionados: {numerosSelecionados.join(', ')}</p>
      </div>

      <div className="botoes-container">
       <button className="btn btn-primary" onClick={completarJogo}>Gerar Jogo</button>
       <button className="btn btn-secondary" onClick={limparVolante}>Limpar Volante</button>
      </div>

      <button className="btn btn-success mt-3" onClick={adicionarJogo}>
        Salvar Jogo
      </button>

      <div className="mt-3">
        <Link to="/app/quinahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      {/* Componente ToastContainer para exibir as notificações */}
      <ToastContainer />
    </div>
  );
}

export default Quina;
