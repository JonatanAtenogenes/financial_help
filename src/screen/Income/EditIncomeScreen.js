import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import IncomeForm from "../../components/IncomeForm"; // Importa el formulario
import { app } from "../../utils/firebase";

const EditIncomeScreen = ({ navigation, route }) => {
  const { income } = route.params; // Recibe los datos del ingreso a editar
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateIncome = async (incomeData) => {
    try {
      const db = getFirestore(app);
      const incomeRef = doc(db, "ingresos", income.id); // Refiere al ingreso existente

      await updateDoc(incomeRef, {
        amount: incomeData.amount,
        type: incomeData.type,
        title: incomeData.title,
        description: incomeData.description,
        updated_at: new Date(), // Marca la fecha de actualización
      });

      Alert.alert("Éxito", "Ingreso actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el ingreso.");
    }
  };

  const handleDeleteIncome = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este ingreso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const db = getFirestore(app);
              const incomeRef = doc(db, "ingresos", income.id);

              await deleteDoc(incomeRef);
              Alert.alert("Éxito", "Ingreso eliminado correctamente.");
              navigation.goBack();
            } catch (error) {
              console.error("Error al eliminar el ingreso:", error);
              Alert.alert("Error", "No se pudo eliminar el ingreso.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Ingreso</Text>
      <IncomeForm
        income={income}
        onSubmit={handleUpdateIncome}
        isUpdate={true}
      />
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
  deleteButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});

export default EditIncomeScreen;
