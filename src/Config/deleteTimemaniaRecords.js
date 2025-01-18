import { getFirestore, collection, query, orderBy, limit, getDocs, doc, writeBatch } from "firebase/firestore";
import firebaseApp from "../Config/firebase";

const db = getFirestore(firebaseApp);

async function deletarRegistrosTimemania() {
  try {
    const q = query(
      collection(db, "historico_timemania"),
      orderBy("sorteio", "desc"),
      limit(999)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Nenhum documento encontrado para deletar.");
      return;
    }

    const batch = writeBatch(db);

    querySnapshot.forEach((documentSnapshot) => {
      const docRef = doc(db, "historico_timemania", documentSnapshot.id);
      batch.delete(docRef);
    });

    await batch.commit();
    console.log("999 documentos deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar documentos:", error.message);
  }
}

export default deletarRegistrosTimemania;