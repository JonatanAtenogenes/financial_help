import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import WelcomeScreen from "./src/screen/WelcomeScreen";
import { useEffect, useState } from "react";
import { app } from "./src/utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashboardScreen from "./src/screen/DashboardScreen";
import SettingsScreen from "./src/screen/SettingsScreen";
import ExpensesScreen from "./src/screen/ExpensesScreen";
import IncomeScreen from "./src/screen/IncomeScreen";

// Import icons from react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";

// Import your colors file
import colors from "./src/utils/colors";
import CreateExpenseScreen from "./src/screen/Expenses/CreateExpenseScreen";
import EditExpenseScreen from "./src/screen/Expenses/EditExpenseScreen";
import CreateIncomeScreen from "./src/screen/Income/CreateIncomeScreen";
import EditIncomeScreen from "./src/screen/Income/EditIncomeScreen";

// Crear un Stack para las pantallas dentro de Expenses
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ExpensesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GastosList"
        component={ExpensesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearGasto"
        component={CreateExpenseScreen}
        options={{ title: "Crear Gasto", headerShown: false }}
      />
      <Stack.Screen
        name="EditarGasto"
        component={EditExpenseScreen}
        options={{ title: "Editar Gasto", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const IncomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListaIngresos"
        component={IncomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearIngreso"
        component={CreateIncomeScreen}
        options={{ title: "Crear Ingreso", headerShown: false }}
      />
      <Stack.Screen
        name="EditarIngreso"
        component={EditIncomeScreen}
        options={{ title: "Editar Ingreso", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // Active tab color
        tabBarInactiveTintColor: colors.secondary, // Inactive tab color
        tabBarStyle: { backgroundColor: colors.surface }, // Background color of the tab bar
      }}
    >
      <Tab.Screen
        name="Inicio" // Spanish title for "Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Gastos" // Spanish title for "Expenses"
        component={ExpensesStack} // Usamos el Stack para gastos
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ingresos"
        component={IncomeStack} // Cambia IncomeScreen por IncomeStack
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Configuración" // Spanish title for "Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is signed in
      } else {
        setUser(false); // User is signed out
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Pass BottomTabNavigator as the component of the Stack.Screen
          <Stack.Screen
            name="BottomTabNavigator" // Spanish title for "Home"
            component={BottomTabNavigator}
            options={{ headerShown: false }} // Hide header
          />
        ) : (
          // If user is not logged in, show Welcome screen
          <Stack.Screen
            name="Bienvenido" // Spanish title for "Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }} // Hide header
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
