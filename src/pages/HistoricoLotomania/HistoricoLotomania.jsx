import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Importe a função query do PostgreSQL
import "./HistoricoJogoLotomania.css";

function HistoricoJogoLotomania() {
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
            hl.*,
            COALESCE(json_agg(cl) FILTER (WHERE cl.id IS NOT NULL), '[]') AS cidades
         FROM historico_lotomania hl
         LEFT JOIN cidades_lotomania cl ON cl.sorteio = hl.sorteio
         GROUP BY hl.id
         ORDER BY hl.sorteio DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const novosDados = result.rows;
      setDados((prevDados) => [...prevDados, ...novosDados]);
      setFinalDaLista(novosDados.length < limit);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
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
            hl.*,
            COALESCE(json_agg(cl) FILTER (WHERE cl.id IS NOT NULL), '[]') AS cidades
         FROM historico_lotomania hl
         LEFT JOIN cidades_lotomania cl ON cl.sorteio = hl.sorteio
         GROUP BY hl.id
         ORDER BY hl.sorteio DESC`
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
      return `${jogo.numeros_sorteados.join("; ")}\n`;
    });

    const conteudo = linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "historico_lotomania.txt";
    link.click();

    toast.success("Arquivo gerado com sucesso!", {
      autoClose: 3000,
      position: "top-center",
    });
  }

  function renderPremios(premios) {
    const premioKeys = [
      { acertos: "20", valor: "premios_v1a", ganhadores: "premios_w1a" },
      { acertos: "19", valor: "premios_v2a", ganhadores: "premios_w2a" },
      { acertos: "18", valor: "premios_v3a", ganhadores: "premios_w3a" },
      { acertos: "17", valor: "premios_v4a", ganhadores: "premios_w4a" },
      { acertos: "16", valor: "premios_v5a", ganhadores: "premios_w5a" },
      { acertos: "15", valor: "premios_v6a", ganhadores: "premios_w6a" },
      { acertos: "0", valor: "premios_v7a", ganhadores: "premios_w7a" },
    ];

    return (
      <table className="premio-detalhes">
        <thead>
          <tr>
            <th>Acertos</th>
            <th>Prêmio</th>
            <th>Ganhadores</th>
          </tr>
        </thead>
        <tbody>
          {premioKeys.map(({ acertos, valor, ganhadores }) => (
            <tr key={acertos}>
              <td>{acertos}</td>
              <td>{premios[valor] || "0,00"}</td>
              <td>{premios[ganhadores] || "0"}</td>
            </tr>
          ))}
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
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - Lotomania</h1>

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
                <td>{renderPremios(jogo)}</td>
                <td>{renderCidadesOuAcumulacao(jogo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Link to="/app/lotomaniahome" className="btn btn-secondary">
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

export default HistoricoJogoLotomania;