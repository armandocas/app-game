import axios from "axios";
import { query } from "./postgresConfig.js"; // Importe a função query do PostgreSQL

async function obterUltimoIdDuplaSena() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_duplasena ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0; // Caso não existam registros
  } catch (error) {
    console.error("Erro ao obter o último ID da Dupla Sena:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosDuplaSenaPG() {
  const baseUrl = "http://localhost:4000/api/duplasena";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdDuplaSena();
    console.log("Último ID encontrado da Dupla Sena:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
      console.log("Coletando dados do sorteio", id);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          const documento = {
            sorteio: parseInt(dados.s),
            data_do_sorteio: dados.d,
            numeros_sorteados_a: dados.na.split("-"), // Números sorteados no primeiro sorteio
            premios_v1a: dados.v1a || "0,00",
            premios_w1a: dados.w1a || "0",
            premios_v2a: dados.v2a || "0,00",
            premios_w2a: dados.w2a || "0",
            premios_v3a: dados.v3a || "0,00",
            premios_w3a: dados.w3a || "0",
            premios_v4a: dados.v4a || "0,00",
            premios_w4a: dados.w4a || "0",
            numeros_sorteados_b: dados.nb.split("-"), // Números sorteados no segundo sorteio
            premios_v1b: dados.v1b || "0,00",
            premios_w1b: dados.w1b || "0",
            premios_v2b: dados.v2b || "0,00",
            premios_w2b: dados.w2b || "0",
            premios_v3b: dados.v3b || "0,00",
            premios_w3b: dados.w3b || "0",
            premios_v4b: dados.v4b || "0,00",
            premios_w4b: dados.w4b || "0",
            data_de_fechamento: dados.nxd || "",
            valor_do_proximo_premio: dados.nxv || "",
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
          INSERT INTO historico_duplasena (
            sorteio,
            data_do_sorteio,
            numeros_sorteados_a,
            premios_v1a,
            premios_w1a,
            premios_v2a,
            premios_w2a,
            premios_v3a,
            premios_w3a,
            premios_v4a,
            premios_w4a,
            numeros_sorteados_b,
            premios_v1b,
            premios_w1b,
            premios_v2b,
            premios_w2b,
            premios_v3b,
            premios_w3b,
            premios_v4b,
            premios_w4b,
            data_de_fechamento,
            valor_do_proximo_premio,
            atualizado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
          RETURNING *
        `;

          const values = [
            documento.sorteio, // 1
            documento.data_do_sorteio, // 2
            documento.numeros_sorteados_a, // 3
            documento.premios_v1a, // 4
            documento.premios_w1a, // 5
            documento.premios_v2a, // 6
            documento.premios_w2a, // 7
            documento.premios_v3a, // 8
            documento.premios_w3a, // 9
            documento.premios_v4a, // 10
            documento.premios_w4a, // 11
            documento.numeros_sorteados_b, // 12
            documento.premios_v1b, // 13
            documento.premios_w1b, // 14
            documento.premios_v2b, // 15
            documento.premios_w2b, // 16
            documento.premios_v3b, // 17
            documento.premios_w3b, // 18
            documento.premios_v4b, // 19
            documento.premios_w4b, // 20
            documento.data_de_fechamento, // 21
            documento.valor_do_proximo_premio, // 22
            documento.atualizado_em // 23
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_duplasena (
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
    console.error("Erro geral ao coletar dados da Dupla Sena:", error.message);
  }

  return dadosColetados;
}

export const obterHistoricoDuplaSena = async () => {
  try {
    const result = await query(`
      SELECT 
          hd.*,
          COALESCE(json_agg(cd) FILTER (WHERE cd.id IS NOT NULL), '[]') AS cidades
      FROM historico_duplasena hd
      LEFT JOIN cidades_duplasena cd ON cd.sorteio = hd.sorteio
      GROUP BY hd.id
      ORDER BY hd.sorteio DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico da Dupla Sena:", error);
    throw error;
  }
};

export default coletarDadosDuplaSenaPG;