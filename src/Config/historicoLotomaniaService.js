import axios from "axios";
import { query } from "./postgresConfig";

async function obterUltimoIdLotomania() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_lotomania ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao obter o último ID da Lotomania:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosLotomaniaPG() {
  const baseUrl = "http://localhost:4000/api/lotomania";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdLotomania();
    console.log("Último ID encontrado da Lotomania:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 5; id++) {
      console.log("Coletando dados do sorteio", id);

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
            premios_v5a: dados.v5a,
            premios_w5a: dados.w5a,
            premios_v6a: dados.v6a,
            premios_w6a: dados.w6a,
            premios_v7a: dados.v7a,
            premios_w7a: dados.w7a,
            data_de_fechamento: dados.nxd || "",
            valor_do_proximo_premio: dados.nxv || "",
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
          INSERT INTO historico_lotomania (
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
            premios_v5a,
            premios_w5a,
            premios_v6a,
            premios_w6a,
            premios_v7a,
            premios_w7a,
            data_de_fechamento,
            valor_do_proximo_premio,
            atualizado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
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
            documento.premios_v4a, // 10
            documento.premios_w4a, // 11
            documento.premios_v5a, // 12
            documento.premios_w5a, // 13
            documento.premios_v6a, // 14
            documento.premios_w6a, // 15
            documento.premios_v7a, // 16
            documento.premios_w7a, // 17
            documento.data_de_fechamento, // 18
            documento.valor_do_proximo_premio, // 19
            documento.atualizado_em // 20
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_lotomania (
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
    console.error("Erro geral ao coletar dados da Lotomania:", error.message);
  }

  return dadosColetados;
}

export const obterHistoricoLotomania = async () => {
  try {
    const result = await query(`
      SELECT 
          hl.*,
          COALESCE(json_agg(cl) FILTER (WHERE cl.id IS NOT NULL), '[]') AS cidades
      FROM historico_lotomania hl
      LEFT JOIN cidades_lotomania cl ON cl.sorteio = hl.sorteio
      GROUP BY hl.id
      ORDER BY hl.sorteio DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico da Lotomania:", error);
    throw error;
  }
};

export default coletarDadosLotomaniaPG;