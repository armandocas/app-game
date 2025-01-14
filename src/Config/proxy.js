const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/lotofacil/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.gigasena.com.br/data/lotofacil/${id}.json`);
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

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));
