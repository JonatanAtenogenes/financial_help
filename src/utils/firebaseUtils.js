import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";

export const fetchExpenses = async () => {
  try {
    const user_id = getAuth().currentUser.uid;
    const db = getFirestore(app);
    const q = query(collection(db, "gastos"), where("user_id", "==", user_id));

    const querySnapshot = await getDocs(q);
    const fetchedExpenses = [];
    querySnapshot.forEach((doc) => {
      fetchedExpenses.push({ ...doc.data(), id: doc.id });
    });

    const totalExpenses = fetchedExpenses.reduce(
      (accumulator, currentValue) => accumulator + (currentValue.amount || 0),
      0
    );

    return { data: fetchedExpenses, total: totalExpenses };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error; // Rethrow to handle it in the
  }
};

export const fetchIncome = async () => {
  try {
    const user_id = getAuth().currentUser.uid;
    const db = getFirestore(app);
    const q = query(
      collection(db, "ingresos"),
      where("user_id", "==", user_id)
    );

    const querySnapshot = await getDocs(q);
    const fetchedIncome = [];
    querySnapshot.forEach((doc) => {
      fetchIncome.push({ ...doc.data(), id: doc.id });
    });

    const totalIncome = fetchedIncome.reduce(
      (accumulator, currentValue) => accumulator + (currentValue.amount || 0),
      0
    );

    return { data: fetchedIncome, total: totalIncome };
  } catch (error) {
    console.error("Error fetching income:", error);
    throw error; // Rethrow to handle it in the calling function
  }
};
