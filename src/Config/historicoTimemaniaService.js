import axios from "axios";
import { query } from "./postgresConfig.js"; // Importe a função query do PostgreSQL

async function obterUltimoIdTimemania() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_timemania ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 662; // ID inicial se não houver registros
  } catch (error) {
    console.error("Erro ao obter o último ID da Timemania:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosTimemaniaPG() {
  const baseUrl = "http://localhost:4000/api/timemania";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdTimemania();
    console.log("Último ID encontrado da Timemania:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
      console.log("Coletando dados do sorteio", id);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          // Verificar se o sorteio já existe
          const existeSorteio = await query(
            'SELECT sorteio FROM historico_timemania WHERE sorteio = $1',
            [dados.s]
          );

          if (existeSorteio.rows.length > 0) {
            console.warn(`Sorteio ${id} já existe. Pulando...`);
            continue; // Pula para o próximo sorteio
          }

          const documento = {
            sorteio: parseInt(dados.s),
            data_do_sorteio: dados.d,
            numeros_sorteados: dados.na.split("-"), // Números sorteados
            premios_v1a: dados.v1a || "0,00",
            premios_w1a: dados.w1a || "0",
            premios_v2a: dados.v2a || "0,00",
            premios_w2a: dados.w2a || "0",
            premios_v3a: dados.v3a || "0,00",
            premios_w3a: dados.w3a || "0",
            premios_v4a: dados.v4a || "0,00",
            premios_w4a: dados.w4a || "0",
            premios_v5a: dados.v5a || "0,00",
            premios_w5a: dados.w5a || "0",
            time_coracao_nome: dados.tcn || "",
            time_coracao_valor: dados.tcv || "0,00",
            time_coracao_ganhadores: dados.tcw || "0",
            data_de_fechamento: dados.nxd || "",
            valor_do_proximo_premio: dados.nxv || "",
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
          INSERT INTO historico_timemania (
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
            time_coracao_nome,
            time_coracao_valor,
            time_coracao_ganhadores,
            data_de_fechamento,
            valor_do_proximo_premio,
            atualizado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
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
            documento.time_coracao_nome, // 14
            documento.time_coracao_valor, // 15
            documento.time_coracao_ganhadores, // 16
            documento.data_de_fechamento, // 17
            documento.valor_do_proximo_premio, // 18
            documento.atualizado_em // 19
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_timemania (
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
    console.error("Erro geral ao coletar dados da Timemania:", error.message);
  }

  return dadosColetados;
}

export const obterHistoricoTimemania = async () => {
  try {
    const result = await query(`
      SELECT 
          ht.*,
          COALESCE(json_agg(ct) FILTER (WHERE ct.id IS NOT NULL), '[]') AS cidades
      FROM historico_timemania ht
      LEFT JOIN cidades_timemania ct ON ct.sorteio = ht.sorteio
      GROUP BY ht.id
      ORDER BY ht.sorteio DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico da Timemania:", error);
    throw error;
  }
};

export default coletarDadosTimemaniaPG;