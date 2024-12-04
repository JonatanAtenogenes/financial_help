import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  fetchExpenses,
  fetchIncome,
  subscribeToExpenses,
  subscribeToIncome,
} from "../utils/firebaseUtils";
import { getWeeklyData } from "../utils/dataUtils";
import Chart from "../components/Chart";

const DashboardScreen = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [balance, setBalance] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyIncomes, setWeeklyIncomes] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await fetchExpenses();
        setExpense(result);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((newExpenses) => {
      setExpense(newExpenses);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadIncome = async () => {
      try {
        const result = await fetchIncome();
        setIncome(result);
      } catch (error) {
        console.error("Error al cargar ingresos:", error);
        Alert.alert("Error", "No se pudieron cargar los ingresos.");
      }
    };
    loadIncome();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToIncome((newIncomes) => {
      setIncome(newIncomes);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const totalIncome = income.reduce((acc, income) => acc + income.amount, 0);
    const totalExpenses = expense.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    console.log(totalIncome);
    setBalance(totalIncome - totalExpenses);
  }, [income, expense]);

  useEffect(() => {
    try {
      const data = getWeeklyData(income);
      setWeeklyIncomes(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [income]);

  useEffect(() => {
    try {
      const data = getWeeklyData(expense);
      setWeeklyExpenses(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [expense]);

  const expenseData = {
    labels: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    datasets: [
      {
        data: weeklyExpenses,
      },
    ],
  };

  const incomeData = {
    labels: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    datasets: [
      {
        data: weeklyIncomes,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.balanceText}>
        {balance >= 0
          ? `Dinero sobrante: $${balance}`
          : `Dinero faltante: $${Math.abs(balance)}`}
      </Text>
      <Text style={styles.chartTitle}>Ingresos</Text>
      <Chart data={incomeData} />
      <Text style={styles.chartTitle}>Gastos</Text>
      <Chart data={expenseData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default DashboardScreen;
