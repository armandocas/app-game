import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000;
const { Pool } = pg;

app.use(cors());
app.use(express.json());

// Adicione isso antes de criar o pool
console.log('Configurações do PostgreSQL:', {
  user: process.env.REACT_APP_PG_USER,
  host: process.env.REACT_APP_PG_HOST,
  database: process.env.REACT_APP_PG_DATABASE,
  port: process.env.REACT_APP_PG_PORT
});

const pool = new Pool({
  user: process.env.REACT_APP_PG_USER,
  host: process.env.REACT_APP_PG_HOST,
  database: process.env.REACT_APP_PG_DATABASE,
  // password: process.env.REACT_APP_PG_PASSWORD,
  password: String(process.env.REACT_APP_PG_PASSWORD),
  port: process.env.REACT_APP_PG_PORT,
});

// Teste inicial de conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro no teste de conexão:', err);
  } else {
    console.log('Teste de conexão bem sucedido:', res.rows[0]);
  }
});

app.post('/api/db', async (req, res) => {
  const { query, params } = req.body;
  console.log('Recebida requisição para query:', query);
  console.log('Parâmetros:', params);
  
  try {
    const result = await pool.query(query, params);
    console.log('Query executada com sucesso:', result.rows.length, 'registros encontrados');
    res.json(result);
  } catch (error) {
    console.error('Erro detalhado na execução da query:', {
      message: error.message,
      stack: error.stack,
      query,
      params
    });
    res.status(500).json({ 
      error: error.message,
      detail: error.detail,
      hint: error.hint
    });
  }
});

// Adicionar verificação de conexão periódica
setInterval(async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com PostgreSQL OK');
    client.release();
  } catch (err) {
    console.error('Erro na verificação de conexão:', err.message);
  }
}, 30000);

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