import { Dimensions, StyleSheet } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import colors from "../utils/colors";

const Chart = ({ data }) => {
  return (
    <LineChart
      data={data}
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
  );
};

export default Chart;

const styles = StyleSheet.create({
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
});
