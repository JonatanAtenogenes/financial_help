import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import IncomeForm from "../../components/IncomeForm"; // Importa el formulario
import { app } from "../../utils/firebase";

const CreateIncomeScreen = ({ navigation }) => {
  // Validar los datos del formulario
  const validateFormData = (incomeData) => {
    if (!incomeData.amount || isNaN(incomeData.amount) || incomeData.amount <= 0) {
      Alert.alert("Error", "El monto debe ser un valor numérico válido.");
      return false;
    }
    if (!incomeData.type || incomeData.type.trim() === "") {
      Alert.alert("Error", "El tipo de ingreso es obligatorio.");
      return false;
    }
    if (!incomeData.title || incomeData.title.trim() === "") {
      Alert.alert("Error", "El título del ingreso es obligatorio.");
      return false;
    }
    return true;
  };

  const handleCreateIncome = async (incomeData) => {
    // Validar los datos del formulario
    if (!validateFormData(incomeData)) return;

    try {
      const db = getFirestore(app);
      const userId = getAuth().currentUser.uid;
      const incomeRef = doc(db, "ingresos", `${userId}_${Date.now()}`);

      await setDoc(incomeRef, {
        amount: incomeData.amount,
        type: incomeData.type,
        title: incomeData.title,
        description: incomeData.description,
        user_id: userId,
        created_at: new Date(),
      });

      Alert.alert("Éxito", "Ingreso creado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear el ingreso:", error);
      Alert.alert("Error", "Hubo un problema al crear el ingreso.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Ingreso</Text>
      <IncomeForm onSubmit={handleCreateIncome} isUpdate={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CreateIncomeScreen;
