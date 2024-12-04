import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import ExpenseForm from "../../components/ExpenseForm";
import { getAuth } from "firebase/auth";
import { app } from "../../utils/firebase";

const CreateExpenseScreen = ({ navigation }) => {
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

  const handleCreateExpense = async (expenseData) => {
    if (!validateFormData(expenseData)) return;

    try {
      const db = getFirestore(app);
      const userId = getAuth().currentUser.uid;
      const expenseRef = doc(db, "gastos", `${userId}_${Date.now()}`);
      await setDoc(expenseRef, {
        amount: expenseData.amount,
        type: expenseData.type,
        title: expenseData.title,
        description: expenseData.description,
        user_id: getAuth().currentUser.uid,
        created_at: new Date(),
      });

      console.log("Gasto creado con éxito.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      Alert.alert("Error", "Hubo un problema al crear el gasto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Gasto</Text>
      <ExpenseForm onSubmit={handleCreateExpense} isUpdate={false} />
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
