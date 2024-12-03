import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { expenseTypes } from "../utils/expensesTypes"; // Tipos de gastos
import colors from "../utils/colors"; // Colores para la app
import { Picker } from "@react-native-picker/picker";

// Componente reutilizable para la creación y actualización de gastos
const ExpenseForm = ({ expense, onSubmit, isUpdate }) => {
  // Estado para los valores del formulario
  const [amount, setAmount] = useState(expense?.amount || "");
  const [category, setCategory] = useState(expense?.type || "");
  const [title, setTitle] = useState(expense?.title || "");
  const [description, setDescription] = useState(expense?.description || "");

  // Al cargar un gasto para actualización, se establece el estado inicial
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.type);
      setTitle(expense.title);
      setDescription(expense.description);
    }
  }, [expense]);

  // Maneja el envío del formulario
  const handleSubmit = () => {
    // Validamos que los datos no estén vacíos
    if (!amount || !category || !title) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const formData = {
      amount: parseFloat(amount),
      type: category,
      title,
      description,
    };

    // Llamamos a la función onSubmit que se pasa como prop
    onSubmit(formData);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Valor del Gasto</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={setAmount}
        placeholder="Ingrese el valor"
      />

      <Text style={styles.label}>Categoría</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Seleccione una categoría" value="" />
        {expenseTypes.map((type) => (
          <Picker.Item key={type.id} label={type.name} value={type.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ingrese el título"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Ingrese una descripción"
        multiline
      />

      {/* Replace Button with TouchableOpacity */}
      <TouchableOpacity
        style={[
          styles.button,
          isUpdate ? styles.updateButton : styles.createButton,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {isUpdate ? "Actualizar Gasto" : "Crear Gasto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: colors.primary, // Color for "Crear Gasto"
  },
  updateButton: {
    backgroundColor: colors.secondary, // Color for "Actualizar Gasto"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExpenseForm;
