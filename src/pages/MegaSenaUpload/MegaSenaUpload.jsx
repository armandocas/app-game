import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./MegaSenaUpload.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/Modal/Modal";
import "../../components/Modal/Modal.css";
import { AuthContext } from "../../../src/app/Context/auth";

// Componente para exibir cada número em uma "bola"
const BolaNumero = ({ numero }) => {
  return <div className="bola-numero">{numero}</div>;
};

function MegaSenaUpload() {
  // Estados do componente
  const [fileContent, setFileContent] = useState("");
  const [contagens, setContagens] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPadrao, setModalPadrao] = useState("");
  const [modalJogos, setModalJogos] = useState([]);
  const [showContagens, setShowContagens] = useState(true);

  const { user } = useContext(AuthContext);
  const db = getFirestore(firebaseApp);

  // Lida com o upload do arquivo .txt
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "text/plain") {
        toast.error("Por favor, faça upload de um arquivo .txt", {
          position: "top-center",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        processarArquivo(content);
        calcularFrequencias(content);
      };
      reader.readAsText(file);
    }
  };

  // Conta quantos números caem em cada intervalo definido (1-10, 11-20, etc)
  const contarNumeros = (numeros) => {
    const ranges = [
      { min: 1, max: 10 },
      { min: 11, max: 20 },
      { min: 21, max: 30 },
      { min: 31, max: 40 },
      { min: 41, max: 50 },
      { min: 51, max: 60 },
    ];

    return ranges.map((range) =>
      numeros.filter((num) => num >= range.min && num <= range.max).length
    );
  };

  // Processa o conteúdo do arquivo e gera as contagens para exibição
  const processarArquivo = (conteudo) => {
    const linhas = conteudo.split("\n");
    const resultadoContagens = [];

    linhas.forEach((linha, index) => {
      if (linha.trim() !== "") {
        const numeros = linha.split(";").map(Number);
        const resultado = contarNumeros(numeros);
        resultadoContagens.push(`Conjunto ${index + 1}: ${resultado.join(", ")}`);
      }
    });

    setContagens(resultadoContagens);
  };

  // Calcula as frequências dos padrões a partir do arquivo
  const calcularFrequencias = (conteudo) => {
    const linhas = conteudo.split("\n");
    const frequenciasTemp = {};

    linhas.forEach((linha) => {
      if (linha.trim() !== "") {
        const numeros = linha.split(";").map(Number);
        const resultado = contarNumeros(numeros);
        const chave = resultado.join(",");
        if (frequenciasTemp[chave]) {
          frequenciasTemp[chave]++;
        } else {
          frequenciasTemp[chave] = 1;
        }
      }
    });

    setFrequencias(frequenciasTemp);
  };

  // Gera todos os padrões possíveis (combinações de 6 números não negativos que somam 6)
  // Cada padrão representa a contagem de números em cada intervalo (separados por vírgula)
  const generateAllPatterns = () => {
    const patterns = [];
    const gerar = (pattern, index, remaining) => {
      if (index === 5) {
        // No último intervalo, o valor restante completa o total de 6
        patterns.push([...pattern, remaining].join(","));
        return;
      }
      for (let i = 0; i <= remaining; i++) {
        gerar([...pattern, i], index + 1, remaining - i);
      }
    };
    gerar([], 0, 6);
    return patterns;
  };

  // Retorna os padrões que nunca saíram, comparando os gerados com os que foram encontrados
  const calcularPadroesNaoSorteados = () => {
    const todosPadroes = generateAllPatterns();
    const padroesNaoSorteados = todosPadroes.filter(
      (padrao) => !frequencias.hasOwnProperty(padrao)
    );
    return padroesNaoSorteados;
  };

  // Abre o modal para gerar jogos a partir de um padrão específico
  const abrirModal = (padrao) => {
    setModalPadrao(padrao);

    const jogosGerados = [];
    // Geramos 3 jogos aleatórios para o padrão selecionado
    for (let i = 0; i < 3; i++) {
      const novoJogo = [];
      // Para cada grupo, usamos os intervalos de 10 (1-10, 11-20, etc)
      padrao.split(",").forEach((quantidade, idx) => {
        const min = idx * 10 + 1;
        const max = idx * 10 + 10;
        // Enquanto não preencher a quantidade desejada para o grupo, sorteamos um número
        while (
          novoJogo.filter((num) => num >= min && num <= max).length <
          parseInt(quantidade)
        ) {
          const numero = Math.floor(Math.random() * (max - min + 1)) + min;
          if (!novoJogo.includes(numero)) novoJogo.push(numero);
        }
      });
      jogosGerados.push(novoJogo.sort((a, b) => a - b));
    }

    setModalJogos(jogosGerados);
    setModalOpen(true);
  };

  // Salva os jogos gerados no Firebase
  const salvarJogosNoFirebase = async () => {
    if (!user || !user.uid) {
      toast.error("Erro: Usuário não está autenticado.", {
        position: "top-center",
      });
      return;
    }

    try {
      console.log("Jogos que serão salvos:", modalJogos, {
        userId: user.uid,
        email: user.email,
      });

      for (const jogo of modalJogos) {
        await addDoc(collection(db, "megasena-jogo-salvo"), {
          numeros: jogo,
          data: new Date().toLocaleString(),
          userId: user.uid,
          email: user.email,
        });
      }
      toast.success("Jogos salvos com sucesso!", {
        position: "top-center",
      });
    } catch (error) {
      if (error.code === "permission-denied") {
        toast.error("Erro: Permissão negada ao salvar os jogos.", {
          position: "top-center",
        });
      } else {
        toast.error("Erro ao salvar jogos no Banco de Dados: " + error.message, {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className="container megasena-upload-container">
      <h1>Mega Sena - Upload</h1>
      <p>
        Faça upload do arquivo .txt com seus jogos e descubra os padrões:
      </p>
      <input type="file" accept=".txt" onChange={handleFileChange} />

      {/* Seção de contagem dos números por intervalo */}
      {fileContent && (
        <div className="mt-4">
          <h2>
            Contagem de Números por Intervalo{" "}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowContagens(!showContagens)}
            >
              {showContagens ? "Minimizar" : "Expandir"}
            </button>
          </h2>
          {showContagens && (
            <>
              {contagens.map((contagem, index) => (
                <p key={index}>
                  <strong>{`Conjunto ${index + 1}:`}</strong>{" "}
                  {contagem.split(": ")[1]}
                </p>
              ))}
            </>
          )}
        </div>
      )}

      {/* Exibição das frequências dos padrões sorteados */}
      {Object.keys(frequencias).length > 0 && (
        <div className="frequencias mt-4">
          <h2>Frequências dos Padrões</h2>
          {Object.entries(frequencias)
            .sort(([, a], [, b]) => b - a)
            .map(([chave, frequencia], index) => (
              <div key={index} className="frequencia-item">
                <span>
                  <strong>{`Padrão ${chave}:`}</strong> {frequencia} vez(es)
                </span>
                <button
                  className="btn-usar-padrao"
                  onClick={() => abrirModal(chave)}
                >
                  Usar Padrão
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Seção unificada para exibir os padrões que nunca saíram com sugestões */}
      {fileContent && calcularPadroesNaoSorteados().length > 0 && (
        <div className="padroes-nao-sorteados mt-4">
          <h2>Padrões que Nunca Saíram</h2>
          {calcularPadroesNaoSorteados().map((padrao, index) => (
            <div key={index} className="sugestao-padrao-item">
              <button
                className="btn-usar-padrao"
                onClick={() => abrirModal(padrao)}
              >
                Usar Padrão
              </button>
              <span>
                <strong>{`Padrão ${padrao}`}</strong>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal para exibição dos jogos gerados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Padrão Selecionado: {modalPadrao}</h3>
        <h4>Jogos Gerados:</h4>
        {modalJogos.map((jogo, index) => (
          <div key={index} className="jogo-bolinhas">
            {jogo.map((num) => (
              <BolaNumero key={num} numero={num} />
            ))}
          </div>
        ))}
        {user ? (
          <button
            className="btn btn-success mt-1"
            onClick={salvarJogosNoFirebase}
          >
            Salvar Jogos
          </button>
        ) : (
          <p className="text-danger">
            Usuário não autenticado. Faça login para salvar os jogos.
          </p>
        )}
      </Modal>

      <div className="mt-3">
        <Link to="/app/megasenahome" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
      <div className="mt-3">
        <Link to="/app/home" className="btn btn-secondary">
          HOME
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default MegaSenaUpload;
