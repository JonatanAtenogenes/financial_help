import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, getFirestore, setDoc, collection, query, getDocs, where } from "firebase/firestore";
import ExpenseForm from "../../components/ExpenseForm";
import { getAuth } from "firebase/auth";
import { app } from "../../utils/firebase";
import { fetchUserCategories } from "../../utils/firebaseUtils"; // Obtener categorías del usuario

const CreateExpenseScreen = ({ navigation }) => {
  const [userCategories, setUserCategories] = useState([]);

  // Cargar las categorías del usuario al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchUserCategories();
        setUserCategories(categories);
      } catch (error) {
        console.error("Error al cargar las categorías del usuario:", error);
      }
    };

    loadCategories();
  }, []);

  const validateFormData = (expenseData) => {
    if (
      !expenseData.amount ||
      isNaN(expenseData.amount) ||
      expenseData.amount <= 0
    ) {
      Alert.alert("Error", "El monto debe ser un valor numérico válido.");
      return false;
    }
    if (!expenseData.type || expenseData.type.trim() === "") {
      Alert.alert("Error", "El tipo de gasto es obligatorio.");
      return false;
    }
    if (!expenseData.title || expenseData.title.trim() === "") {
      Alert.alert("Error", "El título del gasto es obligatorio.");
      return false;
    }
    if (!expenseData.description || expenseData.description.trim() === "") {
      Alert.alert("Error", "La descripción es obligatoria.");
      return false;
    }
    return true;
  };

  const fetchTotals = async () => {
    const db = getFirestore(app);
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("Usuario no autenticado");

    // Obtener ingresos totales
    const incomeQuery = query(
      collection(db, "ingresos"),
      where("user_id", "==", userId)
    );
    const incomeSnapshot = await getDocs(incomeQuery);
    const totalIncome = incomeSnapshot.docs.reduce(
      (sum, doc) => sum + doc.data().amount,
      0
    );

    // Obtener gastos totales
    const expenseQuery = query(
      collection(db, "gastos"),
      where("user_id", "==", userId)
    );
    const expenseSnapshot = await getDocs(expenseQuery);
    const totalExpenses = expenseSnapshot.docs.reduce(
      (sum, doc) => sum + doc.data().amount,
      0
    );

    return { totalIncome, totalExpenses };
  };

  const handleCreateExpense = async (expenseData) => {
    if (!validateFormData(expenseData)) return;

    try {
      const db = getFirestore(app);
      const userId = getAuth().currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      // Obtener los totales de ingresos y gastos
      const { totalIncome, totalExpenses } = await fetchTotals();

      // Sumar el gasto que se quiere agregar al total de gastos
      const projectedTotalExpenses = totalExpenses + expenseData.amount;

      // Validar si la suma supera los ingresos
      if (projectedTotalExpenses > totalIncome) {
        Alert.alert(
          "Límite excedido",
          "El gasto, sumado a tus gastos actuales, excede el total de ingresos disponibles. Agrega un ingreso primero."
        );
        return;
      }

      // Crear el gasto
      const expenseRef = doc(db, "gastos", `${userId}_${Date.now()}`);
      await setDoc(expenseRef, {
        amount: expenseData.amount,
        type: expenseData.type,
        title: expenseData.title,
        description: expenseData.description,
        user_id: userId,
        created_at: new Date(),
      });

      Alert.alert("Éxito", "Gasto creado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      Alert.alert("Error", "Hubo un problema al crear el gasto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Gasto</Text>
      <ExpenseForm onSubmit={handleCreateExpense} userCategories={userCategories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CreateExpenseScreen;
