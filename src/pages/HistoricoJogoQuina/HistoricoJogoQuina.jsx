import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { obterHistoricoQuina } from "../../Config/historicoQuinaService";
import "./HistoricoJogoQuina.css";

function HistoricoJogoQuina() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const novosDados = await obterHistoricoQuina();
      setDados(novosDados.slice(0, 5));
      setFinalDaLista(novosDados.length <= 5);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarMaisDados() {
    if (finalDaLista) return;

    setCarregando(true);
    try {
      const novosDados = await obterHistoricoQuina();
      const novosJogos = novosDados.slice(dados.length, dados.length + 5);
      setDados((prevDados) => [...prevDados, ...novosJogos]);
      setFinalDaLista(novosJogos.length < 5);
    } catch (error) {
      console.error("Erro ao carregar mais dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function baixarTodosJogos() {
    toast.info("Aguarde, estamos gerando seu arquivo...", {
      autoClose: 3000,
      position: "top-center",
    });

    const todosOsDados = await obterHistoricoQuina();

    const linhas = todosOsDados.map((jogo) => {
      return `${jogo.numeros_sorteados.join("; ")}\n`;
    });

    const conteudo = linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "historico_quina.txt";
    link.click();

    toast.success("Arquivo gerado com sucesso!", {
      autoClose: 5000,
      position: "top-center",
    });
  }

  function renderCidadesOuAcumulacao(jogo) {

    console.log("🚀 ~ file: HistoricoJogoQuina.jsx:69 ~ renderCidadesOuAcumulacao ~ jogo:", jogo);

    if (parseInt(jogo.premios_w1a) > 0 && Array.isArray(jogo.cidades) && jogo.cidades.length > 0) {
      // Exibe as cidades dos ganhadores do prêmio principal
      return jogo.cidades.map((cidade, idx) => (
        <div key={idx}>
          {cidade.cidade} - {cidade.estado}
        </div>
      ));
    }
  
    // Se não houver ganhadores, exibe o alerta de acumulação
    return (
      <div>
        <strong>🚨 ACUMULOU! 🚨</strong> <br />
        💰 Próximo prêmio: <strong>{jogo.valor_do_proximo_premio || "N/A"}</strong> <br />
        📍 Data do próximo sorteio: <strong>{jogo.data_de_fechamento || "N/A"}</strong>
      </div>
    );
  }
   

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - Quina</h1>

      {carregando && <p>Carregando...</p>}
      <div className="tabela-container">
        <table className="table">
          <thead>
            <tr>
              <th>Concurso</th>
              <th>Data</th>
              <th>Números Sorteados</th>
              <th>Detalhes do Prêmio</th>
              <th>Cidades dos Ganhadores</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <table className="premio-detalhes">
                    <thead>
                      <tr>
                        <th>Acertos</th>
                        <th>Prêmio</th>
                        <th>Ganhadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Quina</td>
                        <td>{jogo.premios_v1a || "0,00"}</td>
                        <td>{jogo.premios_w1a || "0"}</td>
                      </tr>
                      <tr>
                        <td>Quadra</td>
                        <td>{jogo.premios_v2a || "0,00"}</td>
                        <td>{jogo.premios_w2a || "0"}</td>
                      </tr>
                      <tr>
                        <td>Terno</td>
                        <td>{jogo.premios_v3a || "0,00"}</td>
                        <td>{jogo.premios_w3a || "0"}</td>
                      </tr>
                      <tr>
                        <td>Duque</td>
                        <td>{jogo.premios_v4a || "0,00"}</td>
                        <td>{jogo.premios_w4a || "0"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>{renderCidadesOuAcumulacao(jogo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/quinahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
      <div className="mt-3">
        <button className="btn btn-success ml-2" onClick={baixarTodosJogos}>
          <ToastContainer />
          Baixar Todos os Jogos (.txt)
        </button>
      </div>
      {!finalDaLista && (
        <button
          className="btn btn-primary mt-3"
          onClick={carregarMaisDados}
          disabled={carregando}
        >
          Carregar Jogos Anteriores
        </button>
      )}
    </div>
  );
}

export default HistoricoJogoQuina;
