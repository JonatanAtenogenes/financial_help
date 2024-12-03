import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ExpenseForm from "../../components/ExpenseForm"; // Importa el formulario

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params; // Recibe los datos del gasto a actualizar

  const handleUpdateExpense = (expenseData) => {
    // Aquí se actualizan los datos en la base de datos
    console.log("Actualizar Gasto:", expenseData);
    // Navegar a otra pantalla o mostrar mensaje de éxito
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
    backgroundColor: "red", // Red color for delete button
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
