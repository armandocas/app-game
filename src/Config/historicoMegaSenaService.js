import { getFirestore, collection, setDoc, doc, query, orderBy, limit, getDocs } from "firebase/firestore";
import axios from "axios";
import firebaseApp from "./firebase";

const db = getFirestore(firebaseApp);

async function obterUltimoId() {
    try {
      const q = query(
        collection(db, "historico_megasena"),
        orderBy("sorteio", "desc"),
        limit(1)
      );
  
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const ultimoDocumento = querySnapshot.docs[0].data();
        return ultimoDocumento.sorteio; // Retorna o maior número de sorteio
      } else {
        return 1660; // Caso não tenha nenhum registro
      }
    } catch (error) {
      console.error("Erro ao obter o último ID:", error.message);
      throw new Error("Erro ao obter o último ID");
    }
  }
  

async function coletarDadosMegaSena() {
  const baseUrl = "http://localhost:4000/api/megasena";
  const dadosColetados = [];

  try {
    const ultimoId = await obterUltimoId();
    console.log("Último ID encontrado:", ultimoId);

    for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
      console.log(`Coletando dados do sorteio ${id}...`);

      try {
        const response = await axios.get(`${baseUrl}/${id}`);
        if (response.status === 200) {
          const dados = response.data;

          const documento = {
            sorteio: dados.s,
            data_do_sorteio: dados.d,
            numeros_sorteados: dados.na.split("-"),
            premios: {
              v1a: dados.v1a,
              w1a: dados.w1a,
              v2a: dados.v2a,
              w2a: dados.w2a,
              v3a: dados.v3a,
              w3a: dados.w3a,
            },
            data_de_fechamento: dados.nxd,
            valor_do_proximo_premio: dados.nxv,
            cidades: dados.city.map(city => ({
              cidade: city.c,
              estado: city.u,
              ganhadores: city.w,
            })),
            atualizado_em: new Date().toISOString(),
          };

          await setDoc(doc(collection(db, "historico_megasena"), String(dados.s)), documento);
          dadosColetados.push(documento);
          console.log(`Sorteio ${id} armazenado com sucesso.`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`Sorteio ${id} não encontrado. Pulando...`);
        } else {
          console.error(`Erro no sorteio ${id}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error("Erro geral ao coletar dados:", error.message);
  }

  return dadosColetados;
}

export default coletarDadosMegaSena;
