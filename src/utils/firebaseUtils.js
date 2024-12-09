import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";
import { onSnapshot } from "firebase/firestore";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase"; // Asegúrate de importar correctamente



export const fetchExpenses = async () => {
  const db = getFirestore(app);
  const userId = getAuth().currentUser?.uid;

  if (!userId) throw new Error("Usuario no autenticado");

  const expensesCollection = collection(db, "gastos");
  const q = query(expensesCollection, where("user_id", "==", userId));

  const querySnapshot = await getDocs(q);

  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return expenses;
};

export const subscribeToExpenses = (callback) => {
  const db = getFirestore(app);
  const userId = getAuth().currentUser?.uid;

  if (!userId) throw new Error("Usuario no autenticado");

  const expensesCollection = collection(db, "gastos");
  const q = query(expensesCollection, where("user_id", "==", userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(expenses);
  });

  return unsubscribe;
};

export const deleteExpenseFromDatabase = async (id) => {
  const db = getFirestore(app);
  const expenseRef = doc(db, "gastos", id);

  try {
    await deleteDoc(expenseRef);
    console.log("Gasto eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    throw error;
  }
};

export const subscribeToIncome = (callback) => {
  const db = getFirestore(app);
  const userId = getAuth().currentUser?.uid;

  if (!userId) throw new Error("Usuario no autenticado");

  const incomeCollection = collection(db, "ingresos");
  const q = query(incomeCollection, where("user_id", "==", userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const incomes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(incomes);
  });

  return unsubscribe;
};

export const deleteIncomeFromDatabase = async (id) => {
  const db = getFirestore(app);
  const incomeRef = doc(db, "ingresos", id);

  try {
    await deleteDoc(incomeRef);
    console.log("Ingreso eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar el ingreso:", error);
    throw error;
  }
};

export const fetchIncome = async () => {
  const db = getFirestore(app);
  const userId = getAuth().currentUser?.uid;

  if (!userId) throw new Error("Usuario no autenticado");

  const incomeCollection = collection(db, "ingresos");
  const q = query(incomeCollection, where("user_id", "==", userId));

  const querySnapshot = await getDocs(q);

  const incomes = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return incomes;
};


export const deleteUserCategory = async (categoryId) => {
  try {
    const db = getFirestore(app);
    const categoryRef = doc(db, "categorias_usuarios", categoryId);

    await deleteDoc(categoryRef);
    console.log(`Categoría con ID ${categoryId} eliminada correctamente.`);
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    throw error;
  }
};

// Obtener categorías personalizadas del usuario
export const fetchUserCategories = async () => {
  const db = getFirestore(app);
  const userId = getAuth().currentUser?.uid;

  if (!userId) throw new Error("Usuario no autenticado");

  const q = query(
    collection(db, "categorias_usuarios"),
    where("user_id", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
