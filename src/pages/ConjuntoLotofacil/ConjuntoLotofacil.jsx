import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { obterHistoricoLotoFacil } from '../../Config/historicoLotoFacilService.js';
import './ConjuntoLotofacil.css';
import ModalConjunto from '../../components/Modal-Conjunto/ModalConjunto.jsx';

function ConjuntoLotofacil() {
  const [analisePosPosicao, setAnalisePosPosicao] = useState([]);
  const [jogosGerados, setJogosGerados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAnalise, setCarregandoAnalise] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Define a quantidade padrão de jogos como 5
  const [quantidadeJogos, setQuantidadeJogos] = useState(5);

  const handleClose = () => {
    setShowModal(false);
  };

  const carregarHistorico = useCallback(async () => {
    try {
      setCarregando(true);
      console.log("Iniciando carregamento do histórico...");
      const dados = await obterHistoricoLotoFacil();
      console.log(`Dados carregados: ${dados.length} registros`);
      
      if (!dados || dados.length === 0) {
        toast.warning("Nenhum dado histórico encontrado");
        return;
      }
      
      analisarPosicoes(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast.error(`Erro ao carregar dados históricos: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const analisarPosicoes = (jogos) => {
    setCarregandoAnalise(true);
    try {
      // Inicializa matriz de frequência por posição (15 posições, 25 números possíveis)
      const frequenciaPorPosicao = Array(15).fill().map(() => 
        Array(25).fill(0)
      );

      jogos.forEach(jogo => {
        if (!Array.isArray(jogo.numeros_sorteados)) {
          console.warn("Formato inválido de números sorteados:", jogo);
          return;
        }
        jogo.numeros_sorteados.forEach((numero, posicao) => {
          const num = parseInt(numero);
          if (!isNaN(num) && num > 0 && num <= 25) {
            frequenciaPorPosicao[posicao][num - 1]++;
          }
        });
      });

      const analise = frequenciaPorPosicao.map((freq, pos) => {
        const numeros = freq.map((count, idx) => ({
          numero: idx + 1,
          frequencia: count
        }));
        
        // Ordena por frequência e pega os 5 mais frequentes
        return {
          posicao: pos + 1,
          numerosMaisFrequentes: numeros
            .sort((a, b) => b.frequencia - a.frequencia)
            .slice(0, 5)
        };
      });

      setAnalisePosPosicao(analise);
    } catch (error) {
      console.error("Erro na análise de posições:", error);
      toast.error("Erro ao analisar posições dos números");
    } finally {
      setCarregandoAnalise(false);
    }
  };

  // Gera os jogos com base na análise posicional, sem fechar o modal
  const gerarJogos = () => {
    try {
      const jogos = [];
      for (let i = 0; i < quantidadeJogos; i++) {
        const novoJogo = gerarJogoBaseadoEmPosicoes();
        jogos.push(novoJogo);
      }
      setJogosGerados(jogos);
      toast.success(`${quantidadeJogos} jogos gerados com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar jogos:', error);
      toast.error('Erro ao gerar jogos. Tente novamente.');
    }
  };

  const gerarJogoBaseadoEmPosicoes = () => {
    const jogo = new Set();

    // Para cada posição, escolhe um número entre os mais frequentes que ainda não foi adicionado
    analisePosPosicao.forEach(({ numerosMaisFrequentes }) => {
      const numerosPossiveis = numerosMaisFrequentes
        .filter(n => !jogo.has(n.numero))
        .map(n => n.numero);

      if (numerosPossiveis.length > 0) {
        const numeroEscolhido = numerosPossiveis[
          Math.floor(Math.random() * numerosPossiveis.length)
        ];
        jogo.add(numeroEscolhido);
      }
    });

    // Caso o jogo não contenha 15 números, completa aleatoriamente
    while (jogo.size < 15) {
      const numero = Math.floor(Math.random() * 25) + 1;
      jogo.add(numero);
    }

    return Array.from(jogo).sort((a, b) => a - b);
  };

  const baixarJogos = () => {
    if (jogosGerados.length === 0) {
      toast.warning("Gere alguns jogos primeiro!");
      return;
    }

    const conteudo = jogosGerados
      .map(jogo => jogo.join(";"))
      .join("\n");

    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jogos_lotofacil_posicional.txt";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Jogos baixados com sucesso!");
  };

  // Ao clicar no botão "Gerar Jogos", gera os jogos e abre o modal
  const handleGerarJogos = () => {
    setQuantidadeJogos(5);
    gerarJogos();
    setShowModal(true);
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="conjunto-lotofacil-container">
      <h1>Análise Posicional - Lotofácil</h1>
      <div className="subtitle-container">
        <p className="subtitle">
          Este método analisa a frequência dos números em cada posição dos sorteios anteriores.
          Por exemplo, quais números aparecem mais vezes na primeira posição, na segunda, e assim por diante.
          Esta análise pode revelar padrões interessantes na distribuição dos números sorteados.
        </p>
      </div>
      
      {carregando ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando dados históricos...</p>
        </div>
      ) : (
        <>
          <div className="analise-section">
            <h2>Análise por Posição</h2>
            {carregandoAnalise ? (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Analisando...</span>
                </div>
                <p>Analisando posições...</p>
              </div>
            ) : (
              <div className="posicoes-grid">
                {analisePosPosicao.map(({ posicao, numerosMaisFrequentes }) => (
                  <div key={posicao} className="posicao-card">
                    <h3>Posição {posicao}</h3>
                    <ul>
                      {numerosMaisFrequentes.map(({ numero, frequencia }) => (
                        <li key={numero}>
                          Nº {numero} ({frequencia} vezes)
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="acoes-container">
            <button onClick={handleGerarJogos} className="btn btn-primary">
              Gerar Jogos
            </button>
            <button onClick={baixarJogos} className="btn btn-success">
              Baixar Jogos
            </button>
          </div>

          <ModalConjunto show={showModal} onClose={handleClose} title="Jogos Gerados">
            {jogosGerados.length > 0 ? (
              jogosGerados.map((jogo, idx) => (
                <div key={idx} className="jogo-card">
                  <h3>Jogo {idx + 1}</h3>
                  <div className="numeros-container">
                    {jogo.map(numero => (
                      <span key={numero} className="numero-bolha">
                        {numero}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum jogo gerado.</p>
            )}
          </ModalConjunto>
        </>
      )}

      <div className="navegacao">
        <Link to="/app/lotofacilhome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ConjuntoLotofacil;
