import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../utils/colors"; // Importa los colores

const IncomeForm = ({ onSubmit, isUpdate = false, income = {} }) => {
  const [title, setTitle] = useState(income.title || "");
  const [amount, setAmount] = useState(income.amount ? `${income.amount}` : "");
  const [type, setType] = useState(income.type || "");
  const [description, setDescription] = useState(income.description || "");

  const handleSubmit = () => {
    const incomeData = { title, amount: parseFloat(amount), type, description };
    onSubmit(incomeData);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor={colors.textDisabled}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Monto"
        placeholderTextColor={colors.textDisabled}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Ingreso"
        placeholderTextColor={colors.textDisabled}
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor={colors.textDisabled}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={[
          styles.button,
          isUpdate ? styles.updateButton : styles.createButton,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {isUpdate ? "Actualizar Ingreso" : "Crear Ingreso"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: colors.textPrimary, // Texto principal
    backgroundColor: colors.surface, // Fondo del campo
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  createButton: {
    backgroundColor: colors.primary, // Color for "Crear Gasto"
  },
  updateButton: {
    backgroundColor: colors.secondary, // Color for "Actualizar Gasto"
  },
  buttonText: {
    color: colors.surface, // Texto del botón (blanco)
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default IncomeForm;
