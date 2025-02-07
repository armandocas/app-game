import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Função para realizar queries no PostgreSQL
import "./HistoricoJogoSuperSete.css";

function HistoricoJogoSuperSete() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  async function carregarDados() {
    setCarregando(true);
    try {
      const result = await query(
        `SELECT hs.*, COALESCE(json_agg(cs) FILTER (WHERE cs.id IS NOT NULL), '[]') AS cidades
         FROM historico_supersete hs
         LEFT JOIN cidades_supersete cs ON cs.sorteio = hs.sorteio
         GROUP BY hs.id
         ORDER BY hs.sorteio DESC
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

  async function baixarTodosJogos() {
    toast.info("Aguarde, estamos gerando seu arquivo...", {
      autoClose: 3000,
      position: "top-center",
    });

    const todosOsDados = await query(`
      SELECT numeros_sorteados FROM historico_supersete
    `);

    const linhas = todosOsDados.rows.map((jogo) => jogo.numeros_sorteados.join("; "));

    const conteudo = linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "historico_supersete.txt";
    link.click();

    toast.success("Arquivo gerado com sucesso!", {
      autoClose: 5000,
      position: "top-center",
    });
  }

  function renderCidadesOuAcumulacao(jogo) {
    if (parseInt(jogo.premios_w1a) > 0 && Array.isArray(jogo.cidades) && jogo.cidades.length > 0) {
      return (
        <div className="cidades-ganhadores-card">
          {jogo.cidades.map((cidade, idx) => (
            <div key={idx} className="cidade-info">
              <span className="cidade-nome">{cidade.cidade} - {cidade.estado}</span>
              <span className="ganhadores-info">👥 Ganhadores: {cidade.ganhadores}</span>
            </div>
          ))}
        </div>
      );
    }

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
    <div className="historico-container">
      <h1>Histórico de Jogos - Super Sete</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
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
                        <td>7 acertos</td>
                        <td>{jogo.premios_v1a || "0,00"}</td>
                        <td>{jogo.premios_w1a || "0"}</td>
                      </tr>
                      <tr>
                        <td>6 acertos</td>
                        <td>{jogo.premios_v2a || "0,00"}</td>
                        <td>{jogo.premios_w2a || "0"}</td>
                      </tr>
                      <tr>
                        <td>5 acertos</td>
                        <td>{jogo.premios_v3a || "0,00"}</td>
                        <td>{jogo.premios_w3a || "0"}</td>
                      </tr>
                      <tr>
                        <td>4 acertos</td>
                        <td>{jogo.premios_v4a || "0,00"}</td>
                        <td>{jogo.premios_w4a || "0"}</td>
                      </tr>
                      <tr>
                        <td>3 acertos</td>
                        <td>{jogo.premios_v5a || "0,00"}</td>
                        <td>{jogo.premios_w5a || "0"}</td>
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
        <Link to="/app/supersetehome" className="btn btn-secondary">
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

export default HistoricoJogoSuperSete;
