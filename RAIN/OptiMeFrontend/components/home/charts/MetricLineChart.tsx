import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { colors } from "@/styles/home.styles";

type MetricLineChartProps = {
  data: number[];
  color: string;
  maxValue?: number;
  height?: number;
  onSelectedPointChange?: (point: SelectedLinePoint) => void;
};

export type SelectedLinePoint = {
  index: number;
  value: number;
  dayLabel: string;
  dateLabel: string;
  headerLabel: string;
};

type ChartDay = {
  shortLabel: string;
  fullLabel: string;
  dateLabel: string;
};

export default function MetricLineChart({
  data,
  color,
  maxValue = 100,
  height = 54,
  onSelectedPointChange,
}: MetricLineChartProps) {
  const [width, setWidth] = useState(0);

  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const days = useMemo(() => getLastDays(safeData.length), [safeData.length]);

  const [selectedIndex, setSelectedIndex] = useState(safeData.length - 1);

  useEffect(() => {
    setSelectedIndex(safeData.length - 1);
  }, [safeData.length]);

  const selectedValue =
    safeData[selectedIndex] ?? safeData[safeData.length - 1];

  const selectedDay = days[selectedIndex] ?? days[days.length - 1];

  useEffect(() => {
    if (!selectedDay) {
      return;
    }

    onSelectedPointChange?.({
      index: selectedIndex,
      value: selectedValue,
      dayLabel: selectedDay.fullLabel,
      dateLabel: selectedDay.dateLabel,
      headerLabel: `${selectedDay.fullLabel} · ${selectedDay.dateLabel}`,
    });
  }, [onSelectedPointChange, selectedDay, selectedIndex, selectedValue]);

  const chartData = safeData.map((value, index) => {
    const isSelected = index === selectedIndex;

    return {
      value,
      label: days[index]?.shortLabel ?? "",
      dataPointColor: isSelected ? color : hexToRgba(color, 0.75),
      dataPointRadius: isSelected ? 4 : 3,
      onPress: () => {
        setSelectedIndex(index);
      },
    };
  });

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
          initialSpacing={8}
          endSpacing={8}
          onPress={(_item: unknown, index?: number) => {
            if (typeof index === "number") {
              setSelectedIndex(index);
            }
          }}
          xAxisLabelTextStyle={componentStyles.xAxisLabel}
        />
      )}
    </View>
  );
}

function getLastDays(count: number): ChartDay[] {
  const today = new Date();

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - 1 - index));

    return {
      shortLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(date),
      fullLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date),
      dateLabel: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date),
    };
  });
}

function hexToRgba(hex: string, opacity: number) {
  const normalizedHex = hex.replace("#", "");

  if (normalizedHex.length !== 6) {
    return hex;
  }

  const r = parseInt(normalizedHex.slice(0, 2), 16);
  const g = parseInt(normalizedHex.slice(2, 4), 16);
  const b = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const componentStyles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },

  xAxisLabel: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: "800",
  },
});
