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
  fetchUserCategories,
  deleteUserCategory,
} from "../utils/firebaseUtils";
import Chart from "../components/Chart";
import AddCategoryModal from "../components/AddCategoryModal";
import { getWeeklyData } from "../utils/dataUtils";

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [montlyExpenses, setMontlyExpenses] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [userCategories, setUserCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await fetchExpenses();
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
    const loadCategories = async () => {
      try {
        const categories = await fetchUserCategories();
        setUserCategories(categories);
      } catch (error) {
        console.error("Error al cargar las categorías del usuario:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    try {
      const data = getWeeklyData(expenses);
      setMontlyExpenses(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [expenses]); 


  const handleAddCategory = (newCategory) => {
    setUserCategories((prev) => [...prev, newCategory]); // Agrega la categoría al estado
  };
  
  

  const combinedCategories = [
    ...expenseTypes.filter((type) => type.name !== "Otros"), // Filtrar "Otros"
    ...userCategories,
    { id: "999", name: "Otros", color: "#95a5a6" }, // Añadir "Otros" como última tarjeta
  ];
  

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

  const renderExpenseTypes = ({ item }) => {
    const isUserCategory = userCategories.some((cat) => cat.id === item.id);
  
    const handleDeleteCategory = async () => {
      try {
        Alert.alert(
          "Confirmar eliminación",
          `¿Estás seguro de que deseas eliminar la categoría "${item.name}"?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              onPress: async () => {
                await deleteUserCategory(item.id); // Eliminar de Firestore
                setUserCategories((prev) =>
                  prev.filter((category) => category.id !== item.id)
                ); // Actualizar el estado local
                Alert.alert("Éxito", "Categoría eliminada correctamente.");
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert("Error", "No se pudo eliminar la categoría.");
      }
    };
  
    return (
      <TouchableOpacity
        style={[styles.expenseTypeCard, { backgroundColor: item.color || "#95a5a6" }]}
        onPress={() =>
          item.name === "Otros" ? setIsModalVisible(true) : filterByType(item.name)
        }
        onLongPress={() => isUserCategory && handleDeleteCategory()} // Detectar pulsación larga
      >
        {item.icon || <Ionicons name="ios-add-circle-outline" size={24} color="white" />}
        <Text style={styles.expenseTypeText}>
          {item.name === "Otros" ? "Agregar Categoría" : item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem} key={item.id}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditarGasto", { expense: item })}
        style={styles.expenseDetails}
      >
        <Text style={styles.expenseName}>{item.type}</Text>
        <Text style={styles.expenseAmount}>${item.amount}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteExpenseFromDatabase(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const expenseData = {
    labels: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    datasets: [{ data: montlyExpenses }],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCategoryAdded={(newCategory) => handleAddCategory(newCategory)}
      />
      <Text style={styles.sectionTitle}>Gastos por Semana</Text>
      <Chart data={expenseData} />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CrearGasto")}>
        <Text style={styles.addButtonText}>Agregar Gasto</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Tipos de Gasto</Text>
      <FlatList
        data={combinedCategories}
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
