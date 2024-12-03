// src/utils/expenseTypes.js
import { Ionicons } from "@expo/vector-icons"; // Usamos Expo para los iconos

export const expenseTypes = [
  {
    id: "1",
    name: "Comida",
    icon: <Ionicons name="fast-food" size={24} color="white" />,
    color: "#2ecc71", // Verde
  },
  {
    id: "2",
    name: "Transporte",
    icon: <Ionicons name="car" size={24} color="white" />,
    color: "#3498db", // Azul
  },
  {
    id: "3",
    name: "Entretenimiento",
    icon: <Ionicons name="film" size={24} color="white" />,
    color: "#e74c3c", // Rojo
  },
  {
    id: "4",
    name: "Salud",
    icon: <Ionicons name="medkit" size={24} color="white" />,
    color: "#f39c12", // Amarillo
  },
  {
    id: "5",
    name: "Vivienda",
    icon: <Ionicons name="home" size={24} color="white" />,
    color: "#9b59b6", // Púrpura
  },
  {
    id: "6",
    name: "Educación",
    icon: <Ionicons name="school" size={24} color="white" />,
    color: "#f1c40f", // Amarillo claro
  },
  {
    id: "7",
    name: "Ahorro",
    icon: <Ionicons name="wallet" size={24} color="white" />,
    color: "#16a085", // Verde oscuro
  },
  {
    id: "8",
    name: "Otros",
    icon: <Ionicons name="ios-add-circle-outline" size={24} color="white" />,
    color: "#95a5a6", // Gris
  },
];
