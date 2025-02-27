import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Função para realizar queries no PostgreSQL
import "./HistoricoDeJogosTimeMania.css";

function HistoricoDeJogosTimeMania() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10; // Número de registros por página

  // Carrega os dados paginados
  async function carregarDados() {
    setCarregando(true);
    try {
      const result = await query(
        `SELECT *
         FROM historico_timemania
         ORDER BY sorteio DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const novosDados = result.rows;
      setDados((prevDados) => [...prevDados, ...novosDados]);
      setFinalDaLista(novosDados.length < limit);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
      toast.error("Erro ao carregar dados!");
    } finally {
      setCarregando(false);
    }
  }

  async function carregarMaisDados() {
    if (finalDaLista) return;
    await carregarDados();
  }

  // Função para baixar todos os jogos em um arquivo .txt
  async function baixarTodosJogos() {
    toast.info("Aguarde, estamos gerando seu arquivo...", {
      autoClose: 3000,
      position: "top-center",
    });
    try {
      const result = await query(
        `SELECT *
         FROM historico_timemania
         ORDER BY sorteio DESC`
      );
      const todosOsDados = result.rows;

      // Cria uma linha de texto para cada jogo
      const linhas = todosOsDados.map((jogo) => {
        return `Sorteio: ${jogo.sorteio}
Data: ${jogo.data_do_sorteio}
Números Sorteados: ${
          Array.isArray(jogo.numeros_sorteados)
            ? jogo.numeros_sorteados.join(", ")
            : jogo.numeros_sorteados
        }
Prêmios:
  7 acertos: Prêmio: ${jogo.premios_v1a || "N/A"} - Ganhadores: ${jogo.premios_w1a || "N/A"}
  6 acertos: Prêmio: ${jogo.premios_v2a || "N/A"} - Ganhadores: ${jogo.premios_w2a || "N/A"}
  5 acertos: Prêmio: ${jogo.premios_v3a || "N/A"} - Ganhadores: ${jogo.premios_w3a || "N/A"}
  4 acertos: Prêmio: ${jogo.premios_v4a || "N/A"} - Ganhadores: ${jogo.premios_w4a || "N/A"}
  3 acertos: Prêmio: ${jogo.premios_v5a || "N/A"} - Ganhadores: ${jogo.premios_w5a || "N/A"}
Time do Coração:
  Nome: ${jogo.time_coracao_nome || "N/A"}
  Prêmio: ${jogo.time_coracao_valor || "N/A"}
  Ganhadores: ${jogo.time_coracao_ganhadores || "N/A"}
--------------------------------------\n`;
      });

      const conteudo = linhas.join("\n");
      const blob = new Blob([conteudo], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "historico_timemania.txt";
      link.click();

      toast.success("Arquivo gerado com sucesso!", {
        autoClose: 5000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Erro ao baixar todos os jogos:", error.message);
      toast.error("Erro ao gerar arquivo!");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Jogos - Timemania</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data</th>
              <th>Números Sorteados</th>
              <th>Detalhes do Prêmio</th>
              <th>Time do Coração</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados &&
                      jogo.numeros_sorteados.map((numero, idx) => (
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
                        <td>7</td>
                        <td>{jogo.premios_v1a || "N/A"}</td>
                        <td>{jogo.premios_w1a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>{jogo.premios_v2a || "N/A"}</td>
                        <td>{jogo.premios_w2a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>{jogo.premios_v3a || "N/A"}</td>
                        <td>{jogo.premios_w3a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>{jogo.premios_v4a || "N/A"}</td>
                        <td>{jogo.premios_w4a || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>{jogo.premios_v5a || "N/A"}</td>
                        <td>{jogo.premios_w5a || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <div className="time-coracao-card">
                    <span className="time-nome">
                      {jogo.time_coracao_nome || "N/A"}
                    </span>
                    <div className="time-info">
                      🏆 <strong>Prêmio:</strong> {jogo.time_coracao_valor || "N/A"}
                      <br />
                      👥 <strong>Ganhadores:</strong> {jogo.time_coracao_ganhadores || "N/A"}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/timemaniahome" className="btn btn-secondary">
          Voltar
        </Link>

      <div className="mt-3">
        <button className="btn btn-success ml-2" onClick={baixarTodosJogos}>
          <ToastContainer />
          Baixar Todos os Jogos (.txt)
        </button>
      </div>
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

export default HistoricoDeJogosTimeMania;
