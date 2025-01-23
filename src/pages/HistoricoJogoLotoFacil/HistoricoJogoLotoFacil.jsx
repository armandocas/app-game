import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { obterHistoricoLotoFacil } from "../../Config/historicoLotoFacilService";
import "./HistoricoJogoLotoFacil.css";

function HistoricoJogoLotoFacil() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const novosDados = await obterHistoricoLotoFacil();
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
      const novosDados = await obterHistoricoLotoFacil();
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
    toast.info("Aguarde, estamos gerando seu arquivo...", { autoClose: 1000, 
      position: "top-center"
     });

    const todosOsDados = await obterHistoricoLotoFacil(); // Carregar todos os dados

    const linhas = todosOsDados.map((jogo) => {
      return `${jogo.numeros_sorteados.join("; ")}\n`;
    });

    const conteudo = linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "historico_lotofacil.txt";
    link.click();

    toast.success("Arquivo gerado com sucesso!", { autoClose: 3000,
      position: "top-center"
      });
  }

  function renderCidadesOuAcumulacao(jogo) {
    if (jogo.cidades && Array.isArray(jogo.cidades) && jogo.cidades.length > 0) {
      return jogo.cidades.map((cidade, idx) => (
        <div key={idx}>
          {cidade.cidade} - {cidade.estado}
        </div>
      ));
    } else {
      return (
        <div>
          <strong>🚨 ACUMULOU! 🚨</strong> <br />
          💰 Próximo prêmio: <strong>{jogo.valor_do_proximo_premio}</strong> <br />
          📍 Data do próximo sorteio: <strong>{jogo.data_de_fechamento}</strong>
        </div>
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - LotoFácil</h1>

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
                        <td>15</td>
                        <td>{jogo.premios_v1a}</td>
                        <td>{jogo.premios_w1a}</td>
                      </tr>
                      <tr>
                        <td>14</td>
                        <td>{jogo.premios_v2a}</td>
                        <td>{jogo.premios_w2a}</td>
                      </tr>
                      <tr>
                        <td>13</td>
                        <td>{jogo.premios_v3a}</td>
                        <td>{jogo.premios_w3a}</td>
                      </tr>
                      <tr>
                        <td>12</td>
                        <td>{jogo.premios_v4a}</td>
                        <td>{jogo.premios_w4a}</td>
                      </tr>
                      <tr>
                        <td>11</td>
                        <td>{jogo.premios_v5a}</td>
                        <td>{jogo.premios_w5a}</td>
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
        <Link to="/app/lotofacilhome" className="btn btn-secondary">
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

export default HistoricoJogoLotoFacil;
