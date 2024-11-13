import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '../../Config/firebase';
import './LotoFacil.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LotoFacil() {
  const [fileContent, setFileContent] = useState('');
  const [contagens, setContagens] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [jogos, setJogos] = useState([]);
  const db = getFirestore(firebaseApp);

  // Função para lidar com o upload do arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        processarArquivo(content);  // Mantém a contagem dos números por intervalo
        calcularFrequencias(content); // Calcula as frequências dos padrões
      };
      reader.readAsText(file);
    }
  };

  // Função para contar os números nos intervalos
  const contarNumeros = (numeros) => {
    const ranges = [
      { min: 1, max: 5 },
      { min: 6, max: 10 },
      { min: 11, max: 15 },
      { min: 16, max: 20 },
      { min: 21, max: 25 },
    ];

    return ranges.map((range) =>
      numeros.filter((num) => num >= range.min && num <= range.max).length
    );
  };

  // Função para processar o arquivo e calcular as contagens por intervalo
  const processarArquivo = (conteudo) => {
    const linhas = conteudo.split('\n');
    let resultadoContagens = [];
    let jogosProcessados = [];

    linhas.forEach((linha, index) => {
      if (linha.trim() !== '') {
        const numeros = linha.split(';').map(Number);
        const resultado = contarNumeros(numeros);
        resultadoContagens.push(`Conjunto ${index + 1}: ${resultado.join(', ')}`);
        jogosProcessados.push(numeros);
      }
    });

    setContagens(resultadoContagens);
    setJogos(jogosProcessados);
  };

  // Função para calcular as frequências dos padrões de contagem
  const calcularFrequencias = (conteudo) => {
    const linhas = conteudo.split('\n');
    let frequenciasTemp = {};

    linhas.forEach((linha) => {
      if (linha.trim() !== '') {
        const numeros = linha.split(';').map(Number);
        const resultado = contarNumeros(numeros);
        const chave = resultado.join(',');

        // Contar quantas vezes cada conjunto aparece
        if (frequenciasTemp[chave]) {
          frequenciasTemp[chave]++;
        } else {
          frequenciasTemp[chave] = 1;
        }
      }
    });

    setFrequencias(frequenciasTemp);
  };

  // Função para salvar os jogos no Firebase
  const salvarJogosNoFirebase = async () => {
    try {
      for (const jogo of jogos) {
        await addDoc(collection(db, "lotofacil"), {
          numeros: jogo,
          data: new Date().toLocaleString(),
        });
      }
      toast.success('Jogos salvos com sucesso!', {
        position: "top-center",
      });
    } catch (error) {
      toast.error('Erro ao salvar jogos no Banco de Dados: ' + error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container loto-facil-container">
      <h1>LotoFácil - Inserir Jogos</h1>
      <p>Faça upload do arquivo .txt com seus jogos:</p>
      <input type="file" accept=".txt" onChange={handleFileChange} />

      <div className="botoes-container mt-3">
        {jogos.length > 0 && (
          <button className="btn btn-success" onClick={salvarJogosNoFirebase}>
            Salvar Jogos
          </button>
        )}
      </div>

      {contagens.length > 0 && (
        <div className="contagens mt-4">
          <h2>Contagem de Números por Intervalo</h2>
          {contagens.map((contagem, index) => (
            <p key={index}>
              <strong>{`Conjunto ${index + 1}:`}</strong> {contagem.split(': ')[1]}
            </p>
          ))}
        </div>
      )}

      {Object.keys(frequencias).length > 0 && (
        <div className="frequencias mt-4">
          <h2>Frequências dos Padrões</h2>
          {Object.entries(frequencias).map(([chave, frequencia], index) => (
            <p key={index}>
              <strong>{`Padrão ${chave}:`}</strong> {frequencia} <strong>vez(es)</strong>
            </p>
          ))}
        </div>
      )}

      <div className="mt-3">
        <Link to="/app/home" className="btn btn-secondary">
          Voltar
        </Link>
      </div>

      {/* Componente ToastContainer para exibir as notificações */}
      <ToastContainer />
    </div>
  );
}

export default LotoFacil;
