import React, { useRef, useState } from 'react';
import './MegaSenaEstatistica.css';
import { Link } from 'react-router-dom';

function MegaSenaEstatistica() {
  const [linhas, setLinhas] = useState([]);
  const [probabilidades, setProbabilidades] = useState({});
  const [erro, setErro] = useState(null);
  const fileInputRef = useRef(null);

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
                return !isNaN(valor) && valor >= 1 && valor <= 60 ? valor : null;
              })
              .filter((numero) => numero !== null)
          )
          .filter((linha) => linha.length > 0);

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
      resultado[numero] = ((contador[numero] / totalNumeros) * 100).toFixed(2);
    }

    setProbabilidades(resultado);
  };

  const limparProbabilidades = () => {
    setProbabilidades({});
    setErro(null);
    setLinhas([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container megasena-estatistica-container">
      <h1>📊 Estatísticas - Mega Sena</h1>
      <p>Faça o upload de um arquivo <strong>.txt</strong> para calcular as probabilidades de cada número.</p>

      <input
        type="file"
        accept=".txt"
        className="upload-btn"
        onChange={handleFileUpload}
        ref={fileInputRef}
      />

      <button className="btn btn-primary" onClick={calcularProbabilidade}>
        Calcular Probabilidade
      </button>

      {erro && <p className="erro">{erro}</p>}

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
                .sort(([, probA], [, probB]) => probB - probA)
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

      <div className="mt-3">
        <button className="btn btn-danger" onClick={limparProbabilidades}>
          Limpar Probabilidades
        </button>
      </div>

      <div className="mt-3">
        <Link to="/app/megasenahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    </div>
  );
}

export default MegaSenaEstatistica;
