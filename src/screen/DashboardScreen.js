import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import colors from "../utils/colors"; // Importa los colores
import { getAuth } from "firebase/auth";
import {
  query,
  collection,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app } from "../utils/firebase";

// Datos de ejemplo (deberán ser cargados desde Firebase en el futuro)
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

  const fetchExpenses = async () => {
    try {
      // Query the 'gastos' collection
      const db = getFirestore(app);
      const q = query(
        collection(db, "gastos"),
        where("user_id", "==", getAuth().currentUser.uid)
      );

      // Fetch the documents
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    // Define an async function

    fetchExpenses(); // Call the async function
  }, []); // Empty dependency array ensures it runs only once

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
      <LineChart
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
