import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Importe a função query do PostgreSQL
import "./HistoricoDeJogosDuplaSena.css";

function HistoricoDeJogosDuplaSena() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10; // Número de registros por página

  async function carregarDados() {
    setCarregando(true);
    try {
      const result = await query(
        `SELECT 
            hd.*,
            COALESCE(json_agg(cd) FILTER (WHERE cd.id IS NOT NULL), '[]') AS cidades
         FROM historico_duplasena hd
         LEFT JOIN cidades_duplasena cd ON cd.sorteio = hd.sorteio
         GROUP BY hd.id
         ORDER BY hd.sorteio DESC
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

  async function carregarTodosDados() {
    try {
      const result = await query(
        `SELECT 
            hd.*,
            COALESCE(json_agg(cd) FILTER (WHERE cd.id IS NOT NULL), '[]') AS cidades
         FROM historico_duplasena hd
         LEFT JOIN cidades_duplasena cd ON cd.sorteio = hd.sorteio
         GROUP BY hd.id
         ORDER BY hd.sorteio DESC`
      );
      return result.rows;
    } catch (error) {
      console.error("Erro ao carregar todos os dados:", error.message);
      return [];
    }
  }

  async function baixarTodosJogos() {
    toast.info("Aguarde, estamos gerando seu arquivo...", {
      autoClose: 1000,
      position: "top-center",
    });

    const todosOsDados = await carregarTodosDados();

    const linhas = todosOsDados.map((jogo) => {
      return `1º Sorteio: ${jogo.numeros_sorteados_a.join("; ")}\n2º Sorteio: ${jogo.numeros_sorteados_b.join("; ")}\n`;
    });

    const conteudo = linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "historico_duplasena.txt";
    link.click();

    toast.success("Arquivo gerado com sucesso!", {
      autoClose: 3000,
      position: "top-center",
    });
  }

  function renderPremios(jogo) {
    return (
      <table className="premio-detalhes">
        <thead>
          <tr>
            <th>Acertos</th>
            <th>Prêmio (1º Sorteio)</th>
            <th>Ganhadores</th>
            <th>Prêmio (2º Sorteio)</th>
            <th>Ganhadores</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SENA</td>
            <td>{jogo.premios_v1a || "N/A"}</td>
            <td>{jogo.premios_w1a || "N/A"}</td>
            <td>{jogo.premios_v1b || "N/A"}</td>
            <td>{jogo.premios_w1b || "N/A"}</td>
          </tr>
          <tr>
            <td>QUINA</td>
            <td>{jogo.premios_v2a || "N/A"}</td>
            <td>{jogo.premios_w2a || "N/A"}</td>
            <td>{jogo.premios_v2b || "N/A"}</td>
            <td>{jogo.premios_w2b || "N/A"}</td>
          </tr>
          <tr>
            <td>QUADRA</td>
            <td>{jogo.premios_v3a || "N/A"}</td>
            <td>{jogo.premios_w3a || "N/A"}</td>
            <td>{jogo.premios_v3b || "N/A"}</td>
            <td>{jogo.premios_w3b || "N/A"}</td>
          </tr>
          <tr>
            <td>TERNO</td>
            <td>{jogo.premios_v4a || "N/A"}</td>
            <td>{jogo.premios_w4a || "N/A"}</td>
            <td>{jogo.premios_v4b || "N/A"}</td>
            <td>{jogo.premios_w4b || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  function renderCidadesOuAcumulacao(jogo) {
    if (jogo.cidades && jogo.cidades.length > 0) {
      return jogo.cidades.map((cidade, idx) => (
        <div key={idx}>
          {cidade.cidade} - {cidade.estado}
        </div>
      ));
    } else {
      return (
        <div>
          <strong>🚨 ACUMULOU! 🚨</strong> <br />
          💰 Próximo prêmio: <strong>{jogo.valor_do_proximo_premio || "N/A"}</strong> <br />
          📍 Data do próximo sorteio: <strong>{jogo.data_de_fechamento || "N/A"}</strong>
        </div>
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Jogos - Dupla Sena</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data</th>
              <th>Números Sorteados (1º Sorteio)</th>
              <th>Números Sorteados (2º Sorteio)</th>
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
                    {jogo.numeros_sorteados_a.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="numeros-sorteados-container">
                    {jogo.numeros_sorteados_b.map((numero, idx) => (
                      <div key={idx} className="numero-sorteado">
                        {numero}
                      </div>
                    ))}
                  </div>
                </td>
                <td>{renderPremios(jogo)}</td>
                <td>{renderCidadesOuAcumulacao(jogo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/duplasenahome" className="btn btn-secondary">
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

export default HistoricoDeJogosDuplaSena;