import React, { useState } from 'react';
import './LotoFacilEstatistica.css';

function LotoFacilEstatistica() {
  const [linhas, setLinhas] = useState([]); // Armazena os números do arquivo .txt
  const [probabilidades, setProbabilidades] = useState({});
  const [erro, setErro] = useState(null);

  // Função para ler o arquivo .txt e atualizar "linhas"
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const conteudo = event.target.result;
  
        const novasLinhas = conteudo
          .trim()
          .split("\n")
          .map((linha) =>
            linha
              .split(";")
              .map((numero) => {
                const valor = parseInt(numero, 10);
                return !isNaN(valor) && valor >= 1 && valor <= 25 ? valor : null; // Validação
              })
              .filter((numero) => numero !== null) // Remove entradas inválidas
          )
          .filter((linha) => linha.length > 0); // Remove linhas vazias
  
        if (novasLinhas.length === 0) {
          setErro("O arquivo não contém números válidos.");
        } else {
          setLinhas(novasLinhas);
          setProbabilidades({});
          setErro(null);
        }
      };
  
      reader.onerror = () => {
        setErro("Erro ao ler o arquivo. Certifique-se de que é um arquivo .txt válido.");
      };
  
      reader.readAsText(file);
    }
  };
  

  // Função para calcular probabilidade de cada número
  const calcularProbabilidade = () => {
    if (linhas.length === 0) {
      setErro("Nenhuma linha carregada. Por favor, faça o upload de um arquivo válido.");
      return;
    }

    const contador = {};
    const totalNumeros = linhas.flat().length;

    linhas.forEach((linha) => {
      linha.forEach((numero) => {
        contador[numero] = (contador[numero] || 0) + 1;
      });
    });

    const resultado = {};
    for (const numero in contador) {
      resultado[numero] = ((contador[numero] / totalNumeros) * 100).toFixed(2); // Em %
    }

    setProbabilidades(resultado);
  };

  return (
    <div className="container estatistica-container">
      <h1>📊 Estatísticas - LotoFácil</h1>
      <p>Faça o upload de um arquivo <strong>.txt</strong> para calcular as probabilidades de cada número.</p>

      {/* Input para upload do arquivo */}
      <input
        type="file"
        accept=".txt"
        className="upload-btn"
        onChange={handleFileUpload}
      />

      {/* Botão para calcular as probabilidades */}
      <button className="btn btn-primary" onClick={calcularProbabilidade}>
        Calcular Probabilidade
      </button>

      {/* Exibição de erros */}
      {erro && <p className="erro">{erro}</p>}

      {/* Exibindo os resultados */}
      {Object.keys(probabilidades).length > 0 && (
        <div className="resultado">
          <h2>Probabilidade de Aparição:</h2>
          <table className="tabela-probabilidade">
            <thead>
              <tr>
                <th>Número</th>
                <th>Probabilidade</th>
              </tr>
            </thead>
            <tbody>
            {Object.entries(probabilidades)
  .sort(([, probA], [, probB]) => probB - probA) // Ordena pela probabilidade em ordem decrescente
  .map(([numero, prob]) => (
    <tr key={numero}>
      <td>{numero}</td>
      <td>{prob}%</td>
    </tr>
  ))}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LotoFacilEstatistica;
