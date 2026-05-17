import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type MetricLineChartProps = {
  data: number[];
  color: string;
  maxValue?: number;
  height?: number;
};

export default function MetricLineChart({
  data,
  color,
  maxValue = 100,
  height = 54,
}: MetricLineChartProps) {
  const [width, setWidth] = useState(0);

  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const chartData = safeData.map((value) => ({
    value,
  }));

  return (
    <View
      style={[
        componentStyles.container,
        {
          height,
        },
      ]}
      onLayout={(event) => {
        const nextWidth = Math.floor(event.nativeEvent.layout.width);

        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      {width > 0 && (
        <LineChart
          data={chartData}
          width={width}
          height={height}
          maxValue={maxValue}
          noOfSections={3}
          curved
          areaChart
          disableScroll
          hideRules
          hideYAxisText
          yAxisThickness={0}
          xAxisThickness={0}
          color={color}
          thickness={2}
          dataPointsColor={color}
          dataPointsRadius={3}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.18}
          endOpacity={0.02}
          initialSpacing={4}
          endSpacing={4}
        />
      )}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});
