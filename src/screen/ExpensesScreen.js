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
import { expenseTypes } from "../utils/expensesTypes";
import colors from "../utils/colors";
import { useNavigation } from "@react-navigation/native";
import {
  deleteExpenseFromDatabase,
  fetchExpenses,
  subscribeToExpenses,
} from "../utils/firebaseUtils";
import Chart from "../components/Chart";
import { getWeeklyData } from "../utils/dataUtils";

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [montlyExpenses, setMontlyExpenses] = useState([0, 0, 0, 0, 0, 0, 0]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await fetchExpenses();
        console.log("expenses: ", result);

        setExpenses(result);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((newExpenses) => {
      setExpenses(newExpenses);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      console.warn("Data enviada: ", expenses);
      const data = getWeeklyData(expenses);
      console.log("Data recibida en exchange screen: ", data);
      setMontlyExpenses(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [expenses]);

  useEffect(() => {});

  const expenseData = {
    labels: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    datasets: [
      {
        data: montlyExpenses,
      },
    ],
  };

  const deleteExchange = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este gasto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteExpenseFromDatabase(id);
              setExpenses((prev) =>
                prev.filter((exchange) => exchange.id !== id)
              );
              Alert.alert("Éxito", "Gasto eliminado correctamente.");
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el gasto.");
            }
          },
        },
      ]
    );
  };

  const navigateToAddExpense = () => {
    navigation.navigate("CrearGasto");
  };

  const navigateToUpdateExpense = (expense) => {
    navigation.navigate("EditarGasto", { expense });
  };

  const filterByType = (type) => {
    if (type === "Todos los gastos") {
      setSelectedType(null);
      setFilteredExpenses(expenses);
    } else {
      setSelectedType(type);
      const filtered = expenses.filter((expense) => expense.type === type);
      setFilteredExpenses(filtered);
    }
  };

  useEffect(() => {
    filterByType("Todos los gastos");
  }, [expenses]);

  const renderExpenseTypes = ({ item }) => (
    <TouchableOpacity
      style={[styles.expenseTypeCard, { backgroundColor: item.color }]}
      onPress={() => filterByType(item.name)}
    >
      {item.icon}
      <Text style={styles.expenseTypeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem} key={item.id}>
      <TouchableOpacity
        onPress={() => navigateToUpdateExpense(item)}
        style={styles.expenseDetails}
      >
        <Text style={styles.expenseName}>{item.type}</Text>
        <Text style={styles.expenseAmount}>${item.amount}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteExchange(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Gastos por Semana</Text>
      <Chart data={expenseData} />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddExpense}>
        <Text style={styles.addButtonText}>Agregar Gasto</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Tipos de Gasto</Text>
      <FlatList
        data={[...expenseTypes, { id: "999", name: "Todos los gastos" }]}
        renderItem={renderExpenseTypes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.expenseTypesList}
      />

      <Text style={styles.sectionTitle}>Lista de Gastos</Text>
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
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
  expenseTypesList: {
    marginVertical: 20,
  },
  expenseTypeCard: {
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    minWidth: 100,
    height: 120,
  },
  expenseTypeText: {
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
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  expenseAmount: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  expenseDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default ExpensesScreen;
