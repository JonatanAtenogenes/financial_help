import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import ExpenseForm from "../../components/ExpenseForm";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../utils/firebase";

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params;
  console.warn("Actualizar expense " + expense.id);

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
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Gasto</Text>
      <ExpenseForm
        expense={expense}
        onSubmit={handleUpdateExpense}
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
  deleteButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditExpenseScreen;
