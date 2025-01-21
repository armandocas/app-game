import { query } from './postgresConfig';

export const postgresService = {
  // Exemplo de função para buscar dados
  async buscarDados(tabela) {
    try {
      const result = await query(`SELECT * FROM ${tabela}`);
      return result.rows;
    } catch (error) {
      console.error(`Erro ao buscar dados da tabela ${tabela}:`, error.message);
      throw error;
    }
  },

  // Exemplo de função para inserir dados
  async inserirDados(tabela, dados) {
    try {
      const colunas = Object.keys(dados).join(', ');
      const valores = Object.values(dados);
      const placeholders = valores.map((_, idx) => `$${idx + 1}`).join(', ');

      const query = `
        INSERT INTO ${tabela} (${colunas})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await query(query, valores);
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao inserir dados na tabela ${tabela}:`, error.message);
      throw error;
    }
  }
}; 