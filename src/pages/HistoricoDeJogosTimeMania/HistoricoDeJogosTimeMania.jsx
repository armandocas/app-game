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
                      <tr>
                        <td>TIME</td>
                        <td>{jogo.time_coracao_valor || "N/A"}</td>
                        <td>{jogo.time_coracao_ganhadores|| "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <div className="time-coracao">
                    <p>Nome: {jogo.time_coracao_nome || "N/A"}</p>
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
