import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../utils/colors";
import { fetchIncome } from "../utils/firebaseUtils";
import { getWeeklyData } from "../utils/dataUtils";
import Chart from "../components/Chart";
import { subscribeToIncome } from "../utils/firebaseUtils";
import { deleteIncomeFromDatabase } from "../utils/firebaseUtils";

const IncomeScreen = () => {
  const [incomes, setIncomes] = useState([]);
  const [weeklyIncomes, setWeeklyIncomes] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadIncome = async () => {
      try {
        const result = await fetchIncome();
        setIncomes(result);
      } catch (error) {
        console.error("Error al cargar ingresos:", error);
        Alert.alert("Error", "No se pudieron cargar los ingresos.");
      }
    };
    loadIncome();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToIncome((newIncomes) => {
      setIncomes(newIncomes);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      console.warn("data enviada en incomes: ", incomes);
      const data = getWeeklyData(incomes);
      console.log("dataincome: ", data);
      setWeeklyIncomes(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [incomes]);

  const incomeData = {
    labels: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    datasets: [
      {
        data: weeklyIncomes,
      },
    ],
  };

  const navigateToAddIncome = () => {
    navigation.navigate("CrearIngreso");
  };

  const navigateToEditIncome = (income) => {
    navigation.navigate("EditarIngreso", { income });
  };

  const deleteIncome = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este ingreso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteIncomeFromDatabase(id);
              setIncomes((prev) => prev.filter((income) => income.id !== id));
              Alert.alert("Éxito", "Ingreso eliminado correctamente.");
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el ingreso.");
            }
          },
        },
      ]
    );
  };

  const renderIncomeItem = ({ item }) => (
    <View style={styles.incomeItem}>
      <TouchableOpacity
        onPress={() => navigateToEditIncome(item)}
        style={styles.incomeDetails}
      >
        <Text style={styles.incomeName}>{item.type}</Text>
        <Text style={styles.incomeAmount}>${item.amount}</Text>
        <Text style={styles.incomeDate}>{item.date}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteIncome(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Ingresos por Semana</Text>
      <Chart data={incomeData} />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddIncome}>
        <Text style={styles.addButtonText}>Agregar Ingreso</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Lista de Ingresos</Text>
      <FlatList
        data={incomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginVertical: 10,
  },
  incomeTypesList: {
    marginVertical: 20,
  },
  incomeTypeCard: {
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    minWidth: 100,
    height: 120,
    backgroundColor: colors.incomeCardBackground,
  },
  incomeTypeText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  incomeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  incomeAmount: {
    fontSize: 16,
    color: colors.incomeText,
  },
  incomeDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default IncomeScreen;
