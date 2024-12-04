import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import colors from "../utils/colors";
import { validateEmail } from "../utils/validations";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../utils/firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const Register = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
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

    if (formData.password.length < 6) {
      Alert.alert(
        "Error de validación",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const db = getFirestore(app);
      await setDoc(doc(db, "usuarios", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date(),
      });

      setIsLogin(true);
    } catch (error) {
      Alert.alert(
        "Fallo al registrar usuario",
        "No ha sido posible realizar el registro del usuario correctamente."
      );
      console.error(error.message);
    }
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
        keyboardType="number-pad"
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
