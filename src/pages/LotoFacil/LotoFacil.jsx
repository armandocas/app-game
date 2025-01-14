import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../Config/firebase";
import "./LotoFacil.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalLotoFacil from "../../components/Modal-Lotofacil/ModalLotoFacil";
import "../../components/Modal-Lotofacil/ModalLotoFacil.css";
import { AuthContext } from "../../../src/app/Context/auth";

const BolaNumero = ({ numero }) => {
  return <div className="bola-numero">{numero}</div>;
};

function LotoFacil() {
  const [fileContent, setFileContent] = useState("");
  const [contagens, setContagens] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPadrao, setModalPadrao] = useState("");
  const [modalJogos, setModalJogos] = useState([]);
  const [showContagens, setShowContagens] = useState(true);


  const { user } = useContext(AuthContext);
  const db = getFirestore(firebaseApp);

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

  const processarArquivo = (conteudo) => {
    const linhas = conteudo.split("\n");
    const resultadoContagens = [];
    const jogosProcessados = [];

    linhas.forEach((linha, index) => {
      if (linha.trim() !== "") {
        const numeros = linha.split(";").map(Number);
        const resultado = contarNumeros(numeros);
        resultadoContagens.push(`Conjunto ${index + 1}: ${resultado.join(", ")}`);
        jogosProcessados.push(numeros);
      }
    });

    setContagens(resultadoContagens);
  };

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

  const abrirModal = (padrao) => {
    setModalPadrao(padrao);

    const jogosGerados = [];
    for (let i = 0; i < 3; i++) {
      const novoJogo = [];
      padrao.split(",").forEach((quantidade, idx) => {
        const min = idx * 5 + 1;
        const max = idx * 5 + 5;
        while (novoJogo.filter((num) => num >= min && num <= max).length < parseInt(quantidade)) {
          const numero = Math.floor(Math.random() * (max - min + 1)) + min;
          if (!novoJogo.includes(numero)) novoJogo.push(numero);
        }
      });
      jogosGerados.push(novoJogo.sort((a, b) => a - b));
    }

    setModalJogos(jogosGerados);
    setModalOpen(true);
  };

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
        await addDoc(collection(db, "lotofacil-jogo-salvo"), {
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
    <div className="container loto-facil-container">
      <h1>LotoFácil - Upload</h1>
      <p>Faça upload do arquivo .txt com seus jogos e descubra os padrões:</p>
      <input type="file" accept=".txt" onChange={handleFileChange} />

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
                  <strong>{`Conjunto ${index + 1}:`}</strong> {contagem.split(": ")[1]}
                </p>
              ))}
            </>
          )}
        </div>
      )}

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

      <ModalLotoFacil isOpen={modalOpen} onClose={() => setModalOpen(false)}>
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
           <button className="btn btn-success mt-1" onClick={salvarJogosNoFirebase}>
             Salvar Jogos
          </button>
          ) : (
        <p className="text-danger">Usuário não autenticado. Faça login para salvar os jogos.</p>
       )}

      </ModalLotoFacil>

      <div className="mt-3">
        <Link to="/app/lotofacilhome" className="btn btn-secondary">
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

export default LotoFacil;
