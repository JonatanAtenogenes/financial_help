import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../utils/colors";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase"; // Asegúrate de importar tu configuración de Firebase correctamente

const AddCategoryModal = ({ visible, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");

  // Función para guardar la categoría directamente en Firestore
  const saveUserCategory = async (categoryData) => {
    try {
      const db = getFirestore(app); // Inicializa Firestore
      const auth = getAuth(app); // Inicializa Auth
      const user = auth.currentUser; // Obtiene el usuario autenticado

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const userId = user.uid;
      const categoryId = `${userId}_${Date.now()}`; // Genera un ID único para la categoría
      const categoryRef = doc(db, "categorias_usuarios", categoryId);

      // Guarda los datos de la categoría en Firestore
      await setDoc(categoryRef, {
        ...categoryData,
        user_id: userId,
        created_at: new Date(),
      });

      console.log("Categoría guardada correctamente:", categoryId);
    } catch (error) {
      console.error("Error al guardar la categoría:", error.message || error);
      throw error;
    }
  };

  // Maneja la acción de guardar la categoría
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
      return;
    }
  
    const newCategory = {
      name: categoryName.trim(),
      color: "#95a5a6", // Color similar a "Otros"
      icon: "<Ionicons name='ios-add-circle-outline' size={24} color='white' />",
    };
  
    try {
      await saveUserCategory(newCategory); // Guarda la categoría en Firestore
      onCategoryAdded(newCategory); // Notifica al componente padre
      setCategoryName(""); // Limpia el campo de entrada
      onClose(); // Cierra el modal
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la categoría.");
    }
  };
  
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Agregar Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la Categoría"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveCategory}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddCategoryModal;
