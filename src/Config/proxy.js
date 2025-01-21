const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/lotofacil/:id", async (req, res) => {
  console.log('aqui: ',req.params);
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/lotofacil/${id}.json`);
    console.log('aqui: ',response.data);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados da Lotofácil" });
  }
});

app.get("/api/megasena/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/megasena/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados da Mega Sena" });
  }
});

app.get("/api/quina/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/quina/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao obter os dados da Quina" });
  }
});

app.get("/api/lotomania/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/lotomania/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao obter os dados da Lotomania" });
  }
});

app.get("/api/duplasena/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/duplasena/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados da Dupla Sena" });
  }
});

app.get("/api/timemania/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/timemania/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados da Timemania" });
  }
});

app.get("/api/diadesorte/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/diadesorte/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados do Dia de Sorte" });
  }
});

app.get("/api/supersete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/supersete/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados do Super Sete" });
  }
});

app.get("/api/maismilionaria/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/maismilionaria/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Erro ao obter os dados da Mais Milionária" });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));
