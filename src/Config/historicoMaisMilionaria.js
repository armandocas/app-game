import axios from "axios";
import { query } from "./postgresConfig"; // Função para executar queries no PostgreSQL

/**
 * Obtém o último sorteio registrado na tabela historico_maismilionaria.
 */
async function obterUltimoIdMaisMilionaria() {
  try {
    const result = await query(
      'SELECT sorteio FROM historico_maismilionaria ORDER BY sorteio DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].sorteio;
    }
    return 0; // Se não houver registros, inicia em 0
  } catch (error) {
    console.error("Erro ao obter o último ID da Mais Milionária:", error.message);
    throw new Error("Erro ao obter o último ID");
  }
}

/**
 * Coleta os dados do endpoint da Mais Milionária e insere no PostgreSQL.
 */
async function coletarDadosMaisMilionariaPG() {
  const baseUrl = "http://localhost:4000/api/maismilionaria";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoIdMaisMilionaria();
    console.log("Último ID encontrado da Mais Milionária:", ultimoId);

    // O loop abaixo coleta apenas o próximo sorteio (pode ser ajustado se necessário)
    for (let id = ultimoId + 1; id <= ultimoId + 221; id++) {
      console.log("Coletando dados do sorteio", id);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          // Trata o campo dos números sorteados
          let numeros_sorteados = [];
          if (typeof dados.na === "string") {
            numeros_sorteados = dados.na.split("-").map(num => parseInt(num, 10));
          }

          // Monta o objeto documento com os dados recebidos
          const documento = {
            sorteio: parseInt(dados.s, 10),
            data_do_sorteio: dados.d,
            numeros_sorteados: numeros_sorteados,
            // Prêmios – os valores são recebidos como strings (mantém o formato original)
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
            premios_v6a: dados.v6a || "0,00",
            premios_w6a: dados.w6a || "0",
            premios_v7a: dados.v7a || "0,00",
            premios_w7a: dados.w7a || "0",
            premios_v8a: dados.v8a || "0,00",
            premios_w8a: dados.w8a || "0",
            premios_v9a: dados.v9a || "0,00",
            premios_w9a: dados.w9a || "0",
            premios_v10a: dados.v10a || "0,00",
            premios_w10a: dados.w10a || "0",
            // Trevos
            trevos_trv1: dados.trv1 || "0",
            trevos_trv2: dados.trv2 || "0",
            data_de_fechamento: dados.nxd || "",
            valor_do_proximo_premio: dados.nxv || "",
            atualizado_em: new Date().toISOString(),
          };

          // Query para inserir o sorteio na tabela historico_maismilionaria
          const insertQuery = `
            INSERT INTO historico_maismilionaria (
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
              premios_v8a,
              premios_w8a,
              premios_v9a,
              premios_w9a,
              premios_v10a,
              premios_w10a,
              trevos_trv1,
              trevos_trv2,
              data_de_fechamento,
              valor_do_proximo_premio,
              atualizado_em
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28
            )
            RETURNING *
          `;
          const values = [
            documento.sorteio,             // $1
            documento.data_do_sorteio,     // $2
            documento.numeros_sorteados,   // $3 (array de inteiros)
            documento.premios_v1a,         // $4
            documento.premios_w1a,         // $5
            documento.premios_v2a,         // $6
            documento.premios_w2a,         // $7
            documento.premios_v3a,         // $8
            documento.premios_w3a,         // $9
            documento.premios_v4a,         // $10
            documento.premios_w4a,         // $11
            documento.premios_v5a,         // $12
            documento.premios_w5a,         // $13
            documento.premios_v6a,         // $14
            documento.premios_w6a,         // $15
            documento.premios_v7a,         // $16
            documento.premios_w7a,         // $17
            documento.premios_v8a,         // $18
            documento.premios_w8a,         // $19
            documento.premios_v9a,         // $20
            documento.premios_w9a,         // $21
            documento.premios_v10a,        // $22
            documento.premios_w10a,        // $23
            documento.trevos_trv1,         // $24
            documento.trevos_trv2,         // $25
            documento.data_de_fechamento,  // $26
            documento.valor_do_proximo_premio, // $27
            documento.atualizado_em        // $28
          ];

          await query(insertQuery, values);

          // Se houver cidades, insere cada uma na tabela cidades_maismilionaria
          if (dados.city && Array.isArray(dados.city) && dados.city.length > 0) {
            const cidadeQuery = `
              INSERT INTO cidades_maismilionaria (
                sorteio,
                cidade,
                estado,
                ganhadores
              ) VALUES ($1, $2, $3, $4)
            `;

            for (const city of dados.city) {
              await query(cidadeQuery, [
                dados.s,           // sorteio (mesmo id do sorteio)
                city.c || "",      // cidade
                city.u || "",      // estado
                city.w || 0        // ganhadores
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
    console.error("Erro geral ao coletar dados da Mais Milionária:", error.message);
  }

  return dadosColetados;
}

export default coletarDadosMaisMilionariaPG;
