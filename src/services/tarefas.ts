import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function adicionarTarefa(tarefa: any) {
  await addDoc(collection(db, "tarefas"), tarefa);
}

export async function listarTarefas() {
  const snapshot = await getDocs(collection(db, "tarefas"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}