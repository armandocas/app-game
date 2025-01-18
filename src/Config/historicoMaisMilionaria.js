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
  
  async function obterUltimoIdMaisMilionaria() {
    try {
      const q = query(
        collection(db, "historico_maismilionaria"),
        orderBy("sorteio", "desc"),
        limit(1)
      );
  
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const ultimoDocumento = querySnapshot.docs[0].data();
        return ultimoDocumento.sorteio;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Erro ao obter o último ID da Mais Milionária:", error.message);
      throw new Error("Erro ao obter o último ID");
    }
  }
  
  async function coletarDadosMaisMilionaria() {
    const baseUrl = "http://localhost:4000/api/maismilionaria";
    const dadosColetados = [];
  
    try {
      const ultimoId = await obterUltimoIdMaisMilionaria();
      console.log("Último ID encontrado da Mais Milionária:", ultimoId);
  
      for (let id = ultimoId + 1; id <= ultimoId + 1; id++) {
        console.log("Coletando dados do sorteio", id);
  
        try {
          const response = await axios.get(`${baseUrl}/${id}`);
          if (response.status === 200) {
            const dados = response.data;
  
            const documento = {
              sorteio: dados.s,
              data_do_sorteio: dados.d,
              numeros_sorteados: typeof dados.na === "string"
                ? dados.na.split("-").map(Number)
                : [],
              premios: {
                v1a: dados.v1a || "0,00",
                w1a: dados.w1a || "0",
                v2a: dados.v2a || "0,00",
                w2a: dados.w2a || "0",
                v3a: dados.v3a || "0,00",
                w3a: dados.w3a || "0",
                v4a: dados.v4a || "0,00",
                w4a: dados.w4a || "0",
                v5a: dados.v5a || "0,00",
                w5a: dados.w5a || "0",
                v6a: dados.v6a || "0,00",
                w6a: dados.w6a || "0",
                v7a: dados.v7a || "0,00",
                w7a: dados.w7a || "0",
                v8a: dados.v8a || "0,00",
                w8a: dados.w8a || "0",
                v9a: dados.v9a || "0,00",
                w9a: dados.w9a || "0",
                v10a: dados.v10a || "0,00",
                w10a: dados.w10a || "0",
              },
              trevos: {
                trv1: dados.trv1 || "0",
                trv2: dados.trv2 || "0",
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
              doc(collection(db, "historico_maismilionaria"), String(dados.s)),
              documento
            );
            dadosColetados.push(documento);
          }
        } catch (error) {
          console.error(`Erro ao coletar dados para o sorteio ${id}:`, error.message);
        }
      }
    } catch (error) {
      console.error("Erro geral ao coletar dados da Mais Milionária:", error.message);
    }
  
    return dadosColetados;
  }
  
  export default coletarDadosMaisMilionaria;