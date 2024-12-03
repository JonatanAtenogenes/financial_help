import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import colors from "../utils/colors"; // Import the colors object
import { validateEmail } from "../utils/validations";

const Register = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleRegister = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      Alert.alert("Error de validación", "Todos los campos son requeridos.");
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Error de validación", "El correo electrónico no es válido.");
      return;
    }
    // Handle registration logic
    Alert.alert("Registro exitoso", "Te has registrado con éxito.");
  };

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={formData.password}
        secureTextEntry
        onChangeText={(value) => handleInputChange("password", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={formData.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(true)}>
        <Text style={styles.switchText}>
          ¿Ya tienes una cuenta? Iniciar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  switchText: {
    textAlign: "center",
    color: colors.secondary,
    marginTop: 10,
  },
});

export default Register;
