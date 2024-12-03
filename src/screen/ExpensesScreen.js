import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit"; // Import the library for charts
import { expenseTypes } from "../utils/expensesTypes"; // Expense types
import colors from "../utils/colors"; // Colors for the app
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { fetchExpenses } from "../utils/firebaseUtils";

// Fake data for expenses
const initialExpenses = [
  { id: "1", type: "Comida", amount: 150, date: "2024-12-01" },
  { id: "2", type: "Transporte", amount: 50, date: "2024-12-02" },
  { id: "3", type: "Entretenimiento", amount: 120, date: "2024-12-03" },
  { id: "4", type: "Salud", amount: 200, date: "2024-12-04" },
  { id: "5", type: "Vivienda", amount: 300, date: "2024-12-05" },
  { id: "6", type: "Educación", amount: 100, date: "2024-12-06" },
  { id: "7", type: "Ahorro", amount: 50, date: "2024-12-07" },
  { id: "8", type: "Otros", amount: 80, date: "2024-12-08" },
];

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // For tracking selected expense type
  const navigation = useNavigation(); // Initialize the navigation hook

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await fetchExpenses();
        setExpenses(result.data);
        setFilteredExpenses(result.data); // Set expenses data and total
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  // Function to navigate to the Add Expense screen
  const navigateToAddExpense = () => {
    navigation.navigate("CrearGasto"); // Navigate to the 'CrearGasto' screen
  };

  // Function to navigate to the Update Expense screen
  const navigateToUpdateExpense = (expense) => {
    navigation.navigate("EditarGasto", { expense }); // Pass the selected expense to the update screen
  };

  // Function to delete an expense
  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    setFilteredExpenses(
      selectedType
        ? updatedExpenses.filter((expense) => expense.type === selectedType)
        : updatedExpenses
    );
  };

  // Function to filter expenses by type
  const filterByType = (type) => {
    if (type === "Todos los gastos") {
      setSelectedType(null);
      setFilteredExpenses(expenses); // Show all expenses if no type is selected
    } else {
      setSelectedType(type);
      const filtered = expenses.filter((expense) => expense.type === type);
      setFilteredExpenses(filtered);
    }
  };

  // Function to render the expense types
  const renderExpenseTypes = ({ item }) => (
    <TouchableOpacity
      style={[styles.expenseTypeCard, { backgroundColor: item.color }]}
      onPress={() => filterByType(item.name)}
    >
      {item.icon}
      <Text style={styles.expenseTypeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Function to render the list of expenses
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
      {/* Delete button */}
      <TouchableOpacity
        onPress={() => deleteExpense(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  // Data for the monthly expense chart
  const chartData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        data: [120, 150, 130, 170, 190, 210, 250, 230, 210, 240, 220, 200], // Monthly expense data
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Monthly expense chart */}
      <Text style={styles.sectionTitle}>Gastos por Mes</Text>
      <LineChart
        data={chartData}
        width={350} // Adjust the size of the chart
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.background,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Button to add an expense */}
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddExpense}>
        <Text style={styles.addButtonText}>Agregar Gasto</Text>
      </TouchableOpacity>

      {/* Expense Types */}
      <Text style={styles.sectionTitle}>Tipos de Gasto</Text>
      <FlatList
        data={[...expenseTypes, { id: "999", name: "Todos los gastos" }]} // Add option to show all expenses
        renderItem={renderExpenseTypes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.expenseTypesList}
      />

      {/* List of filtered expenses */}
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
    paddingBottom: 50, // Extra space to prevent content cutoff
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
    minWidth: 100, // Ensure cards don't shrink below 100px
    height: 120, // Fixed height for the cards
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
