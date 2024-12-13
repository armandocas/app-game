import React, { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./HistoricoJogoLotoFacil.css";

// Instância do Firestore
const db = getFirestore(firebaseApp);

function HistoricoJogoLotoFacil() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Estados para filtros
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroPremio, setFiltroPremio] = useState("");
  const [filtroNumero, setFiltroNumero] = useState("");

  // Converte YYYY-MM-DD para DD/MM/YYYY
  function ajustarDataParaFormatoDDMMYYYY(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // Função para carregar dados com filtros
  async function carregarDadosComFiltros() {
    setCarregando(true);
    try {
      let q = collection(db, "historico_lotofacil");

      // Aplica filtros
      const filtros = [];
      if (filtroDataInicio && filtroDataFim) {
        const dataInicio = ajustarDataParaFormatoDDMMYYYY(filtroDataInicio);
        const dataFim = ajustarDataParaFormatoDDMMYYYY(filtroDataFim);
        console.log("Filtro Data Início:", dataInicio);
        console.log("Filtro Data Fim:", dataFim);
        filtros.push(where("data_do_sorteio", ">=", dataInicio));
        filtros.push(where("data_do_sorteio", "<=", dataFim));
      }
      if (filtroCidade) {
        filtros.push(where("cidades.cidade", "==", filtroCidade));
      }
      if (filtroPremio) {
        filtros.push(where("premios.v1a", ">=", filtroPremio));
      }
      if (filtroNumero) {
        filtros.push(where("numeros_sorteados", "array-contains", filtroNumero));
      }

      // Monta a query
      const qFinal = query(q, ...filtros);
      const querySnapshot = await getDocs(qFinal);

      const dadosFiltrados = querySnapshot.docs.map((doc) => doc.data());
      setDados(dadosFiltrados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="historico-jogo-container">
      <h1>Histórico de Jogo - LotoFácil</h1>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="date"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
          placeholder="Data Início"
        />
        <input
          type="date"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
          placeholder="Data Fim"
        />
        <input
          type="text"
          value={filtroCidade}
          onChange={(e) => setFiltroCidade(e.target.value)}
          placeholder="Cidade"
        />
        <input
          type="number"
          value={filtroPremio}
          onChange={(e) => setFiltroPremio(e.target.value)}
          placeholder="Prêmio Mínimo"
        />
        <input
          type="number"
          value={filtroNumero}
          onChange={(e) => setFiltroNumero(e.target.value)}
          placeholder="Número Sorteado"
        />
        <button onClick={carregarDadosComFiltros}>Aplicar Filtros</button>
      </div>

      {carregando && <p>Carregando...</p>}
      <div className="tabela-container">
        <table className="table">
          <thead>
            <tr>
              <th>Sorteio</th>
              <th>Data</th>
              <th>Números Sorteados</th>
              <th>Prêmio Principal</th>
              <th>Cidades dos Ganhadores</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((jogo) => (
              <tr key={jogo.sorteio}>
                <td>{jogo.sorteio}</td>
                <td>{jogo.data_do_sorteio}</td>
                <td>{jogo.numeros_sorteados.join(", ")}</td>
                <td>{jogo.premios.v1a}</td>
                <td>
                  {jogo.cidades.map((cidade, idx) => (
                    <div key={idx}>
                      {cidade.cidade} - {cidade.estado}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoricoJogoLotoFacil;
