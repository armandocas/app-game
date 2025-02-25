// Em vez de importar pg diretamente, vamos usar fetch para comunicar com o backend
const query = async (text, params) => {
  try {
    console.log('Tentando conectar ao servidor PostgreSQL...');
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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Resposta do servidor:', result);
    return result;
  } catch (err) {
    console.error('Erro detalhado ao executar query:', {
      message: err.message,
      stack: err.stack,
      query: text,
      params: params
    });
    throw err;
  }
};

export { query }; 