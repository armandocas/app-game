require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.REACT_APP_PG_USER,
  host: process.env.REACT_APP_PG_HOST,
  database: process.env.REACT_APP_PG_DATABASE,
  password: process.env.REACT_APP_PG_PASSWORD,
  port: process.env.REACT_APP_PG_PORT,
});

app.post('/api/db', async (req, res) => {
  const { query, params } = req.body;
  console.log('query: ', query);
  console.log('params: ', params);
  try {
    const result = await pool.query(query, params);
    res.json(result);
  } catch (error) {
    console.error('Erro na execução da query:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor PostgreSQL rodando em http://localhost:${PORT}`);
  // Teste de conexão
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao PostgreSQL:', err.message);
      return;
    }
    console.log('Conectado com sucesso ao PostgreSQL');
    release();
  });
}); 