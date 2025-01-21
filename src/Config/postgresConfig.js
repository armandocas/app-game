// Em vez de importar pg diretamente, vamos usar fetch para comunicar com o backend
const query = async (text, params) => {
  try {
    const response = await fetch('http://localhost:5000/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        params: params
      })
    });
    
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Erro ao executar query:', err.message);
    throw err;
  }
};

export { query }; 