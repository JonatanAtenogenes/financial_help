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
import { app } from "../utils/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      Alert.alert(
        "Error de validación",
        "El correo electrónico y la contraseña son requeridos."
      );
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Error de validación", "El correo electrónico no es válido.");
      return;
    }

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(
          "Fallo al iniciar sesión",
          "No ha sido posible iniciar sesión correctamente."
        );
      });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Iniciar sesión</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(false)}>
        <Text style={styles.switchText}>¿No tienes una cuenta? Regístrate</Text>
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

export default Login;
