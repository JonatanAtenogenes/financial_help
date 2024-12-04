const getDayOfWeek = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return date.getDay();
};

const getStartOfWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  today.setDate(today.getDate() - diff);
  today.setHours(0, 0, 0, 0);
  return today;
};

const groupByDayOfWeek = (data) => {
  const currentWeekStart = getStartOfWeek();
  const weekData = Array(7).fill(0);

  data.forEach((item) => {
    const dayOfWeek = getDayOfWeek(item.created_at);
    const itemDate = new Date(
      item.created_at.seconds * 1000 + item.created_at.nanoseconds / 1000000
    );
    if (itemDate >= currentWeekStart) {
      weekData[dayOfWeek] += item.amount || 0;
    }
  });

  return weekData;
};

export const getWeeklyData = (data) => {
  const groupedData = groupByDayOfWeek(data);
  return groupedData;
};
