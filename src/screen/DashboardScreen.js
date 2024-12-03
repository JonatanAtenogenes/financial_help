import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import colors from "../utils/colors"; // Importa los colores

// Datos falsos para las gráficas
const expenseData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      data: [200, 450, 300, 400, 500, 600], // Gastos
    },
  ],
};

const incomeData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      data: [300, 550, 400, 700, 750, 900], // Ingresos
    },
  ],
};

const DashboardScreen = () => {
  // Cálculo de dinero sobrante o faltante (Ejemplo)
  const totalIncome = 3200; // Ingresos totales
  const totalExpense = 2200; // Gastos totales
  const balance = totalIncome - totalExpense; // Dinero sobrante o faltante

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Gráfica de Ingresos */}
      <Text style={styles.chartTitle}>Ingresos</Text>
      <LineChart
        data={incomeData}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.primary,
          backgroundGradientTo: colors.secondary,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.secondary,
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
          backgroundGradientFrom: colors.primary,
          backgroundGradientTo: colors.accent,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      {/* Dinero sobrante o faltante */}
      <Text style={styles.balanceText}>
        {balance >= 0
          ? `Dinero sobrante: $${balance}`
          : `Dinero faltante: $${Math.abs(balance)}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 20,
  },
});

export default DashboardScreen;
