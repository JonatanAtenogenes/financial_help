import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, getFirestore, setDoc } from "firebase/firestore"; // Firestore functions
import ExpenseForm from "../../components/ExpenseForm"; // Importa el formulario
import { getAuth } from "firebase/auth";
import { app } from "../../utils/firebase";

const CreateExpenseScreen = ({ navigation, route }) => {
  // Validate the form data to ensure no values are null or empty
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
    // Validate the input fields
    if (!validateFormData(expenseData)) return;

    try {
      const db = getFirestore(app);
      // Create a unique document reference for the new expense
      const expenseRef = doc(
        db,
        "gastos",
        `${getAuth().currentUser.uid}_${Date.now()}`
      ); // Using userId and timestamp as the document ID

      // Insert the expense data into Firestore
      await setDoc(expenseRef, {
        amount: expenseData.amount,
        type: expenseData.type,
        title: expenseData.title,
        description: expenseData.description,
        user_id: getAuth().currentUser.uid, // Attach the user ID
        created_at: new Date(), // Timestamp for when the expense was created
      });

      console.log("Gasto creado con éxito.");
      navigation.goBack(); // Navigate back after successful creation
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
