import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { expenseTypes } from "../utils/expensesTypes";
import colors from "../utils/colors";
import { Picker } from "@react-native-picker/picker";

const ExpenseForm = ({ expense, onSubmit, isUpdate }) => {
  const [amount, setAmount] = useState(expense?.amount || "");
  const [category, setCategory] = useState(expense?.type || "");
  const [title, setTitle] = useState(expense?.title || "");
  const [description, setDescription] = useState(expense?.description || "");

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.type);
      setTitle(expense.title);
      setDescription(expense.description);
    }
  }, [expense]);

  const handleSubmit = () => {
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
    backgroundColor: colors.primary,
  },
  updateButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExpenseForm;
