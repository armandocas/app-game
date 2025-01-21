import axios from "axios";
import { query } from "./postgresConfig";

async function obterUltimoIdPG() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_lotofacil ORDER BY sorteio DESC LIMIT 1'
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

async function coletarDadosLotofacilPG() {
  const baseUrl = "http://localhost:4000/api/lotofacil";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdPG();
    console.log("Último ID encontrado:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 10; id++) {
      console.log(`Coletando dados do sorteio ${id}...`);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          const documento = {
            sorteio: parseInt(dados.s),
            data_do_sorteio: dados.d,
            numeros_sorteados: dados.na.split("-"),
            premios_v1a: parseFloat(dados.v1a.replace('.', '').replace(',', '.')), 
            premios_w1a: parseFloat(dados.w1a.replace('.', '').replace(',', '.')), 
            premios_v2a: parseFloat(dados.v2a.replace('.', '').replace(',', '.')), 
            premios_w2a: parseFloat(dados.w2a.replace('.', '').replace(',', '.')), 
            premios_v3a: parseFloat(dados.v3a.replace('.', '').replace(',', '.')), 
            premios_w3a: parseFloat(dados.w3a.replace('.', '').replace(',', '.')), 
            premios_v4a: parseFloat(dados.v4a.replace('.', '').replace(',', '.')),
            premios_w4a: parseFloat(dados.w4a.replace('.', '').replace(',', '.')), 
            premios_v5a: parseFloat(dados.v5a.replace('.', '').replace(',', '.')), 
            premios_w5a: parseFloat(dados.w5a.replace('.', '').replace(',', '.')), 
            data_de_fechamento: dados.nxd,
            valor_do_proximo_premio: dados.nxv.replace('.', '').replace(',', '.'), // Mantém como string
            atualizado_em: new Date().toISOString()
          };

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

          await query(insertQuery, values);

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

export default coletarDadosLotofacilPG; 