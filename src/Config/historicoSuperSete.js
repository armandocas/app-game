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
  
  async function obterUltimoIdSuperSete() {
    try {
      const q = query(
        collection(db, "historico_supersete"),
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
      console.error("Erro ao obter o último ID do Super Sete:", error.message);
      throw new Error("Erro ao obter o último ID");
    }
  }
  
  async function coletarDadosSuperSete() {
    const baseUrl = "http://localhost:4000/api/supersete";
    const dadosColetados = [];
  
    try {
      const ultimoId = await obterUltimoIdSuperSete();
      console.log("Último ID encontrado do Super Sete:", ultimoId);
  
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
              doc(collection(db, "historico_supersete"), String(dados.s)),
              documento
            );
            dadosColetados.push(documento);
          }
        } catch (error) {
          console.error(`Erro ao coletar dados para o sorteio ${id}:`, error.message);
        }
      }
    } catch (error) {
      console.error("Erro geral ao coletar dados do Super Sete:", error.message);
    }
  
    return dadosColetados;
  }
  
  export default coletarDadosSuperSete;