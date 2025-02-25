import axios from "axios";
import { query } from "./postgresConfig.js";

async function obterUltimoIdQuina() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_quina ORDER BY sorteio DESC LIMIT 1'
    );

    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao obter o último ID da Quina:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosQuinaPG() {
  const baseUrl = "http://localhost:4000/api/quina";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdQuina();
    console.log("Último ID encontrado:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
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
            premios_v4a: dados.v4a,
            premios_w4a: dados.w4a,
            data_de_fechamento: dados.nxd,
            valor_do_proximo_premio: dados.nxv,
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
            INSERT INTO historico_quina (
              sorteio,
              data_do_sorteio,
              numeros_sorteados,
              premios_v1a,
              premios_w1a,
              premios_v2a,
              premios_w2a,
              premios_v3a,
              premios_w3a,
              premios_v4a,
              premios_w4a,
              data_de_fechamento,
              valor_do_proximo_premio,
              atualizado_em
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING *
          `;

          const values = [
            documento.sorteio,
            documento.data_do_sorteio,
            documento.numeros_sorteados,
            documento.premios_v1a,
            documento.premios_w1a,
            documento.premios_v2a,
            documento.premios_w2a,
            documento.premios_v3a,
            documento.premios_w3a,
            documento.premios_v4a,
            documento.premios_w4a,
            documento.data_de_fechamento,
            documento.valor_do_proximo_premio,
            documento.atualizado_em,
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_quina (
                sorteio,
                cidade,
                estado,
                ganhadores
              ) VALUES ($1, $2, $3, $4)
            `;

            for (const city of dados.city) {
              await query(cidadeQuery, [
                documento.sorteio,
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

export const obterHistoricoQuina = async () => {
  try {
    const result = await query(`
      SELECT 
          hq.*,
          COALESCE(json_agg(cq) FILTER (WHERE cq.id IS NOT NULL), '[]') AS cidades
      FROM historico_quina hq
      LEFT JOIN cidades_quina cq ON cq.sorteio = hq.sorteio
      GROUP BY hq.id
      ORDER BY hq.sorteio DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico da Quina:", error);
    throw error;
  }
};

export default coletarDadosQuinaPG;
