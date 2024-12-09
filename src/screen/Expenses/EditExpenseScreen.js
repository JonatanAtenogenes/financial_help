import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import ExpenseForm from "../../components/ExpenseForm";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../utils/firebase";
import { fetchUserCategories } from "../../utils/firebaseUtils";

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params;
  const [userCategories, setUserCategories] = useState([]);

  useEffect(() => {
    const loadUserCategories = async () => {
      try {
        const categories = await fetchUserCategories(); // Obtener las categorías de usuario
        setUserCategories(categories);
      } catch (error) {
        console.error("Error al cargar las categorías de usuario:", error);
      }
    };

    loadUserCategories();
  }, []);

  const handleUpdateExpense = async (expenseData) => {
    try {
      const db = getFirestore(app);
      const expenseRef = doc(db, "gastos", expense.id);

      await updateDoc(expenseRef, {
        amount: expenseData.amount,
        type: expenseData.type,
        title: expenseData.title,
        description: expenseData.description,
        updated_at: new Date(),
      });
      Alert.alert("Éxito", "Gasto actualizado correctamente.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Hubo un problema al actualizar el Gasto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Gasto</Text>
      <ExpenseForm
        expense={expense}
        onSubmit={handleUpdateExpense}
        userCategories={userCategories} // Pasar las categorías de usuario al formulario
        isUpdate={true}
      />
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

export default EditExpenseScreen;
