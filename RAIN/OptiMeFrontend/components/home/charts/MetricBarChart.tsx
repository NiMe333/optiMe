import { useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

type MetricBarChartProps = {
  data: number[];
  color: string;
  maxValue?: number;
  height?: number;
};

export default function MetricBarChart({
  data,
  color,
  maxValue,
  height = 54,
}: MetricBarChartProps) {
  const [width, setWidth] = useState(0);

  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const calculatedMaxValue = maxValue || Math.max(...safeData, 1);

  const chartData = safeData.map((value, index) => ({
    value,
    label: weekLabels[index],
    frontColor: color,
  }));

  return (
    <View
      style={{ width: "100%", height, overflow: "hidden" }}
      onLayout={(event) => {
        const nextWidth = Math.floor(event.nativeEvent.layout.width);

        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      {width > 0 && (
        <BarChart
          data={chartData}
          width={width}
          height={height}
          maxValue={calculatedMaxValue}
          noOfSections={3}
          disableScroll
          hideRules
          hideYAxisText
          yAxisThickness={0}
          xAxisThickness={0}
          barWidth={10}
          spacing={10}
          roundedTop
          roundedBottom
          initialSpacing={4}
          endSpacing={4}
          xAxisLabelTextStyle={{
            color: "#6E8092",
            fontSize: 10,
            fontWeight: "700",
          }}
        />
      )}
    </View>
  );
}
