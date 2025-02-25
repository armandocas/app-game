import axios from "axios";
import { query } from "./postgresConfig.js";

async function obterUltimoIdPG() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_lotofacil ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (!result || !result.rows) {
      console.error("Erro: Resultado da query inválido");
      return 1141; // Fallback
    }

    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 1141; // Fallback se a tabela estiver vazia
  } catch (error) {
    console.error("Erro ao obter o último ID:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

async function coletarDadosLotofacilPG() {
  const baseUrl = "http://localhost:4000/api/lotofacil";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdPG();
    console.log("Último ID encontrado:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 2; id++) {
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
            premios_v5a: dados.v5a, 
            premios_w5a: dados.w5a, 
            data_de_fechamento: dados.nxd,
            valor_do_proximo_premio: dados.nxv,
            atualizado_em: new Date().toISOString()
          };

          // Log dos dados que serão inseridos
          console.log("Dados a serem inseridos:", documento);

          // Inserir no PostgreSQL
          const insertQuery = `
            INSERT INTO historico_lotofacil (
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
              data_de_fechamento,
              valor_do_proximo_premio,
              atualizado_em
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
            documento.premios_v5a,
            documento.premios_w5a,
            documento.data_de_fechamento,
            documento.valor_do_proximo_premio,
            documento.atualizado_em
          ];

          // Log da query e valores
          console.log("Query de inserção:", insertQuery);
          console.log("Valores:", values);

          // Executa a query de inserção e adiciona a depuração adicional
          try {
            const result = await query(insertQuery, values);
            console.log("Resultado da query de inserção:", result); // Log completo do resultado

            if (result && result.rows && result.rows.length > 0) {
              console.log("Inserção bem-sucedida:", result.rows[0]);
            } else {
              console.error("Erro: Nenhum registro foi inserido.");
              console.error("Query executada:", insertQuery);
              console.error("Valores passados:", values);
            }
          } catch (error) {
            console.error("Erro durante a inserção:", error.message);
            console.error("Query executada:", insertQuery);
            console.error("Valores passados:", values);
          }

          // Inserir cidades em uma tabela separada
          if (dados.city && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_lotofacil (
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
                city.w
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


export const obterHistoricoLotoFacil = async () => {
  try {
    const result = await query(`
      SELECT 
          hl.*,
          COALESCE(json_agg(cl) FILTER (WHERE cl.id IS NOT NULL), '[]') AS cidades
      FROM historico_lotofacil hl
      LEFT JOIN cidades_lotofacil cl ON cl.sorteio = hl.sorteio
      GROUP BY hl.id
      ORDER BY hl.sorteio DESC
    `);

    return result.rows; // Retorna os dados do histórico
  } catch (error) {
    console.error("Erro ao obter histórico do LotoFácil:", error);
    throw error; // Repassa o erro para ser tratado na função chamadora
  }
};

export default coletarDadosLotofacilPG; 