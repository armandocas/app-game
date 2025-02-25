import axios from "axios";
import { query } from "./postgresConfig.js"; // Importe a função query do PostgreSQL

async function obterUltimoIdDiaDeSorte() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_diadesorte ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0; // ID inicial se não houver registros
  } catch (error) {
    console.error("Erro ao obter o último ID do Dia de Sorte:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosDiaDeSortePG() {
  const baseUrl = "http://localhost:4000/api/diadesorte";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdDiaDeSorte();
    console.log("Último ID encontrado do Dia de Sorte:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
      console.log("Coletando dados do sorteio", id);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

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
            mes_da_sorte_nome: dados.msn || "",
            mes_da_sorte_valor: dados.msv || "0,00",
            mes_da_sorte_ganhadores: dados.msw || "0",
            data_de_fechamento: dados.nxd || "",
            valor_do_proximo_premio: dados.nxv || "",
            atualizado_em: new Date().toISOString(),
          };

          // Inserir no PostgreSQL
          const insertQuery = `
          INSERT INTO historico_diadesorte (
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
            mes_da_sorte_nome,
            mes_da_sorte_valor,
            mes_da_sorte_ganhadores,
            data_de_fechamento,
            valor_do_proximo_premio,
            atualizado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
            documento.mes_da_sorte_nome, // 12
            documento.mes_da_sorte_valor, // 13
            documento.mes_da_sorte_ganhadores, // 14
            documento.data_de_fechamento, // 15
            documento.valor_do_proximo_premio, // 16
            documento.atualizado_em // 17
          ];

          await query(insertQuery, values);

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_diadesorte (
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
    console.error("Erro geral ao coletar dados do Dia de Sorte:", error.message);
  }

  return dadosColetados;
}

export const obterHistoricoDiaDeSorte = async () => {
  try {
    const result = await query(`
      SELECT 
          hd.*,
          COALESCE(json_agg(cd) FILTER (WHERE cd.id IS NOT NULL), '[]') AS cidades
      FROM historico_diadesorte hd
      LEFT JOIN cidades_diadesorte cd ON cd.sorteio = hd.sorteio
      GROUP BY hd.id
      ORDER BY hd.sorteio DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter histórico do Dia de Sorte:", error);
    throw error;
  }
};

export default coletarDadosDiaDeSortePG;