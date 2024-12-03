import { fetchExpenses, fetchIncome } from "../utils/firebaseUtils";

// Función para obtener el día de la semana (0: domingo, 1: lunes, ..., 6: sábado)
const getDayOfWeek = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return date.getDay(); // Obtiene el día de la semana (0: domingo, 1: lunes, etc.)
};

// Función para obtener el inicio de la semana (lunes)
const getStartOfWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1; // Si es domingo (0), ajustamos para el lunes
  today.setDate(today.getDate() - diff);
  today.setHours(0, 0, 0, 0); // Establecemos la hora a medianoche
  return today;
};

// Función para agrupar los gastos o ingresos por día de la semana
const groupByDayOfWeek = (data) => {
  const currentWeekStart = getStartOfWeek();
  const weekData = Array(7).fill(0); // Creamos un array con 7 elementos inicializados en 0

  data.forEach((item) => {
    const dayOfWeek = getDayOfWeek(item.created_at);
    const itemDate = new Date(
      item.created_at.seconds * 1000 + item.created_at.nanoseconds / 1000000
    );

    // Verificamos si la fecha está dentro de la semana actual
    if (itemDate >= currentWeekStart) {
      weekData[dayOfWeek] += item.amount || 0; // Sumamos el amount del ingreso/gasto al día correspondiente
    }
  });

  return weekData;
};

// Función para obtener los ingresos o gastos por cada día de la semana
export const getWeeklyData = (data) => {
  // Agrupamos los datos por día de la semana
  const groupedData = groupByDayOfWeek(data);

  console.log("grouped data: ", groupedData);

  // Retornamos los 7 días con el total de los ingresos o gastos
  return groupedData;
};
