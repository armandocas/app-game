import {
    getFirestore,
    collection,
    setDoc,
    doc,
    query,
    orderBy,
    limit,
    getDocs,
  } from "firebase/firestore";
  import axios from "axios";
  import firebaseApp from "./firebase";
  
  const db = getFirestore(firebaseApp);
  
  async function obterUltimoIdDuplaSena() {
    try {
      const q = query(
        collection(db, "historico_duplasena"),
        orderBy("sorteio", "desc"),
        limit(1)
      );
  
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const ultimoDocumento = querySnapshot.docs[0].data();
        return ultimoDocumento.sorteio;
      } else {
        return 0; // Caso não existam registros
      }
    } catch (error) {
      console.error("Erro ao obter o último ID da Dupla Sena:", error.message);
      throw new Error("Erro ao obter o último ID");
    }
  }
  
  async function coletarDadosDuplaSena() {
    const baseUrl = "http://localhost:4000/api/duplasena";
    const dadosColetados = [];
  
    try {
      const ultimoId = await obterUltimoIdDuplaSena();
      console.log("Último ID encontrado da Dupla Sena:", ultimoId);
  
      for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
        console.log("Coletando dados do sorteio", id);
  
        try {
          const response = await axios.get(`${baseUrl}/${id}`);
          if (response.status === 200) {
            const dados = response.data;
  
            const documento = {
              sorteio: dados.s,
              data_do_sorteio: dados.d,
              numeros_sorteados_primeiro: typeof dados.na === "string"
                ? dados.na.split("-").map(Number)
                : [],
              numeros_sorteados_segundo: typeof dados.nb === "string"
                ? dados.nb.split("-").map(Number)
                : [],
              premios_primeiro: {
                v1a: dados.v1a || "0,00",
                w1a: dados.w1a || 0,
                v2a: dados.v2a || "0,00",
                w2a: dados.w2a || 0,
                v3a: dados.v3a || "0,00",
                w3a: dados.w3a || 0,
                v4a: dados.v4a || "0,00",
                w4a: dados.w4a || 0,
              },
              premios_segundo: {
                v1b: dados.v1b || "0,00",
                w1b: dados.w1b || 0,
                v2b: dados.v2b || "0,00",
                w2b: dados.w2b || 0,
                v3b: dados.v3b || "0,00",
                w3b: dados.w3b || 0,
                v4b: dados.v4b || "0,00",
                w4b: dados.w4b || 0,
              },
              data_de_fechamento: dados.nxd || "",
              valor_do_proximo_premio: dados.nxv || "",
              cidades: Array.isArray(dados.city)
                ? dados.city.map((city) => ({
                    cidade: city.c || "",
                    estado: city.u || "",
                    ganhadores: city.w || 0,
                  }))
                : [],
              atualizado_em: new Date().toISOString(),
            };
  
            console.log("Salvando documento:", documento);
  
            await setDoc(
              doc(collection(db, "historico_duplasena"), String(dados.s)),
              documento
            );
            dadosColetados.push(documento);
          }
        } catch (error) {
          console.error(`Erro ao coletar dados para o sorteio ${id}:`, error.message);
        }
      }
    } catch (error) {
      console.error("Erro geral ao coletar dados da Dupla Sena:", error.message);
    }
  
    return dadosColetados;
  }
  
  export default coletarDadosDuplaSena;
  