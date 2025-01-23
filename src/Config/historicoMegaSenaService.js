import axios from "axios";
import { query } from "./postgresConfig";

async function obterUltimoIdPG() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_megasena ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao obter o último ID:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosMegaSenaPG() {
  const baseUrl = "http://localhost:4000/api/megasena";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdPG();
    console.log("Último ID encontrado:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1149; id++) {
      console.log(`Coletando dados do sorteio ${id}...`);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          const documento = {
            sorteio: parseInt(dados.s),
            data_do_sorteio: dados.d,
            numeros_sorteados: dados.na.split("-"),
            premios_v1a: dados.v1a,
            premios_w1a: dados.w1a,
            premios_v2a: dados.v2a,
            premios_w2a: dados.w2a,
            premios_v3a: dados.v3a,
            premios_w3a: dados.w3a,
            data_de_fechamento: dados.nxd,
            valor_do_proximo_premio: dados.nxv,
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
          INSERT INTO historico_megasena (
            sorteio,
            data_do_sorteio,
            numeros_sorteados,
            premios_v1a,
            premios_w1a,
            premios_v2a,
            premios_w2a,
            premios_v3a,
            premios_w3a,
            data_de_fechamento,
            valor_do_proximo_premio,
            atualizado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *
        `;

          const values = [
            documento.sorteio, // 1
            documento.data_do_sorteio, // 2
            documento.numeros_sorteados, // 3
            documento.premios_v1a, // 4
            documento.premios_w1a, // 5
            documento.premios_v2a, // 6
            documento.premios_w2a, // 7
            documento.premios_v3a, // 8
            documento.premios_w3a, // 9
            documento.data_de_fechamento, // 10
            documento.valor_do_proximo_premio, // 11
            documento.atualizado_em // 12
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_megasena (
                sorteio,
                cidade,
                estado,
                ganhadores
              ) VALUES ($1, $2, $3, $4)
            `;

            for (const city of dados.city) {
              await query(cidadeQuery, [
                dados.s,
                city.c,
                city.u,
                city.w,
              ]);
            }
          }

          dadosColetados.push(documento);
          console.log(`Sorteio ${id} armazenado com sucesso.`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`Sorteio ${id} não encontrado. Pulando...`);
        } else {
          console.error(`Erro no sorteio ${id}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error("Erro geral ao coletar dados:", error.message);
  }

  return dadosColetados;
}

export const obterHistoricoMegaSena = async () => {
  try {
    const result = await query(
      'SELECT * FROM historico_megasena ORDER BY sorteio DESC'
    );
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico da Mega Sena:", error);
    throw error;
  }
};

export default coletarDadosMegaSenaPG;
