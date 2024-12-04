import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import colors from "../utils/colors";

const SettingsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        } else {
          Alert.alert("Error", "No se encontraron datos del usuario.");
        }
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      Alert.alert("Error", "Hubo un problema al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserData = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "usuarios", user.uid);

        await updateDoc(docRef, {
          name: userData.name,
          phone: userData.phone,
        });

        Alert.alert("Éxito", "Datos actualizados correctamente.");
        setIsEditable(false);
      }
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      Alert.alert("Error", "Hubo un problema al actualizar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Éxito", "Sesión cerrada correctamente.");
      navigation.replace("Bienvenido");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const auth = getAuth();
              const user = auth.currentUser;

              if (user) {
                const db = getFirestore();
                const docRef = doc(db, "usuarios", user.uid);

                await deleteDoc(docRef); // Eliminar datos del Firestore
                await deleteUser(user); // Eliminar cuenta de Firebase Auth
                Alert.alert("Éxito", "Cuenta eliminada correctamente.");
                navigation.replace("Bienvenido");
              }
            } catch (error) {
              console.error("Error al eliminar cuenta:", error);
              Alert.alert("Error", "No se pudo eliminar la cuenta.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCancelEdit = () => {
    fetchUserData(); // Revertir cambios si se cancela la edición
    setIsEditable(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos de la cuenta</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.inputDisabled]}
            placeholder="Nombre de Usuario"
            value={userData.name}
            editable={isEditable}
            onChangeText={(value) => setUserData({ ...userData, name: value })}
          />
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="Correo Electrónico"
            value={userData.email}
            editable={false} // No permitir edición del correo
          />
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.inputDisabled]}
            placeholder="Teléfono"
            value={userData.phone}
            editable={isEditable}
            keyboardType="phone-pad"
            onChangeText={(value) => setUserData({ ...userData, phone: value })}
          />

          {!isEditable ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditable(true)}
            >
              <Text style={styles.buttonText}>Editar Datos</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateUserData}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonText}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
    textAlign:'center'
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    marginBottom: 15,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.textDisabled,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
    backgroundColor:colors.secondary
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  logoutButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SettingsScreen;
