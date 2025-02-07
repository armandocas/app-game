import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { query } from "../../Config/postgresConfig"; // Função para executar queries no PostgreSQL
import "./HistoricoDeJogosMaisMilionaria.css";

function HistoricoDeJogosMaisMilionaria() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [finalDaLista, setFinalDaLista] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10; // Número de registros por página

  // Carrega os dados com paginação
  async function carregarDados() {
    setCarregando(true);
    try {
      const result = await query(
        `SELECT *
         FROM historico_maismilionaria
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
         FROM historico_maismilionaria
         ORDER BY sorteio DESC`
      );
      const todosOsDados = result.rows;

      // Para cada jogo, cria uma linha de texto com os dados desejados
      const linhas = todosOsDados.map((jogo) => {
        return `Sorteio: ${jogo.sorteio}
Data do Sorteio: ${jogo.data_do_sorteio}
Números Sorteados: ${
          Array.isArray(jogo.numeros_sorteados)
            ? jogo.numeros_sorteados.join(", ")
            : jogo.numeros_sorteados
        }
Trevos Sorteados: ${jogo.trevos_trv1} - ${jogo.trevos_trv2}
Data de Fechamento: ${jogo.data_de_fechamento || "N/A"}
Valor do Próximo Prêmio: ${jogo.valor_do_proximo_premio || "N/A"}
---------------------------\n`;
      });

      const conteudo = linhas.join("\n");
      const blob = new Blob([conteudo], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "historico_maismilionaria.txt";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Jogos - Mais Milionária</h1>
      <ToastContainer />
      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data do Sorteio</th>
              <th>Números Sorteados</th>
              <th>Trevos Sorteados</th>
              <th>Detalhes dos Prêmios</th>
              <th>Data de Fechamento</th>
              <th>Valor do Próximo Prêmio</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>
                  <div className="numeros-sorteados-container">
                    {Array.isArray(jogo.numeros_sorteados) &&
                      jogo.numeros_sorteados.map((numero, idx) => (
                        <div key={idx} className="numero-sorteado">
                          {numero}
                        </div>
                      ))}
                  </div>
                </td>
                <td>
                 <div className="trevos-container">
                  <span className="trevo">
                   {jogo.trevos_trv1}
                  </span>
                  <span className="trevo">
                   {jogo.trevos_trv2}
                  </span>
                 </div>
                </td>
                <td>
                  <table className="premio-detalhes">
                    <thead>
                      <tr>
                        <th>Faixa</th>
                        <th>Prêmio</th>
                        <th>Ganhadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((faixa) => (
                        <tr key={faixa}>
                          <td>{faixa}</td>
                          <td>{jogo[`premios_v${faixa}a`] || "N/A"}</td>
                          <td>{jogo[`premios_w${faixa}a`] || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{jogo.data_de_fechamento || "N/A"}</td>
                <td>{jogo.valor_do_proximo_premio || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <Link to="/app/milionariahome" className="btn btn-secondary">
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

export default HistoricoDeJogosMaisMilionaria;
