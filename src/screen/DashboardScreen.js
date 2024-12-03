import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import colors from "../utils/colors"; // Importa los colores
import { fetchExpenses, fetchIncome } from "../utils/firebaseUtils";
import { getWeeklyData } from "../utils/dataUtils";

const DashboardScreen = () => {
  // Cálculo de dinero sobrante o faltante (Ejemplo)
  const [income, setIncome] = useState({}); // Ingresos totales
  const [expense, setExpense] = useState({});
  const [balance, setBalance] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyIncomes, setWeeklyIncomes] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await fetchExpenses();
        setExpense(result); // Set expenses data and total
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    };

    const loadIncome = async () => {
      try {
        const result = await fetchIncome();
        setIncome(result); // Set income data and total
      } catch (error) {
        console.error("Failed to load incomes:", error);
      }
    };

    loadExpenses();
    loadIncome();
  }, []); // Empty dependency array ensures it runs only once

  useEffect(() => {
    // Recalculate balance when expense data changes
    setBalance(income.total - expense.total);
  }, [income, expense]);

  useEffect(() => {
    try {
      const data = getWeeklyData(income.data);
      setWeeklyIncomes(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [income]);

  useEffect(() => {
    try {
      const data = getWeeklyData(expense.data);
      setWeeklyExpenses(data);
    } catch (e) {
      console.log("No hay elementos");
    }
  }, [expense]);

  const expenseData = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    datasets: [
      {
        data: weeklyExpenses, // Gastos
      },
    ],
  };

  const incomeData = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    datasets: [
      {
        data: weeklyIncomes, // Gastos
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Dinero sobrante o faltante */}
      <Text style={styles.balanceText}>
        {balance >= 0
          ? `Dinero sobrante: $${balance}`
          : `Dinero faltante: $${Math.abs(balance)}`}
      </Text>

      {/* Gráfica de Ingresos */}
      <Text style={styles.chartTitle}>Ingresos</Text>
      <LineChart
        data={incomeData}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
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
        bezier
        style={styles.chart}
      />

      {/* Gráfica de Gastos */}
      <Text style={styles.chartTitle}>Gastos</Text>
      <BarChart
        data={expenseData}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
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
        bezier
        style={styles.chart}
      />
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
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default DashboardScreen;
