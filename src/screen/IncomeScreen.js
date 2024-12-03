import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import colors from "../utils/colors";
import { fetchIncome } from "../utils/firebaseUtils";
import { getWeeklyData } from "../utils/dataUtils";
import Chart from "../components/Chart";

const initialIncomes = [
  { id: "1", type: "Salario", amount: 1000, date: "2024-12-01" },
  { id: "2", type: "Freelance", amount: 500, date: "2024-12-02" },
  { id: "3", type: "Inversiones", amount: 300, date: "2024-12-03" },
];

const IncomeScreen = () => {
  const [incomes, setIncomes] = useState([]);
  const [weeklyIncomes, setWeeklyIncomes] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadIncome = async () => {
      try {
        const result = await fetchIncome();
        setIncomes(result.data); // Set income data and total
      } catch (error) {
        console.error("Failed to load incomes:", error);
      }
    };
    loadIncome();
  }, []);

  useEffect(() => {
    try {
      const data = getWeeklyData(incomes);
      setWeeklyIncomes(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [incomes]);

  const incomeData = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
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
          onPress: () => {
            setIncomes((prev) => prev.filter((income) => income.id !== id));
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

  const chartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [500, 700, 800, 900, 1100, 1200],
      },
    ],
  };

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
    paddingBottom: 50, // Espacio extra para evitar contenido cortado
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
    minWidth: 100, // Asegura que las tarjetas no se reduzcan más allá de 100px
    height: 120, // Altura fija para las tarjetas
    backgroundColor: colors.incomeCardBackground, // Color específico para ingresos
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
    color: colors.incomeText, // Color específico para el monto de ingresos
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
