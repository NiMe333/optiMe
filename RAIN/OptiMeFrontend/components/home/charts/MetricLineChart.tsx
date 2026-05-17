import { useEffect, useState } from "react";
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
  isToday: boolean;
};

const DAYS_TO_SHOW = 6;

export default function MetricLineChart({
  data,
  color,
  maxValue = 100,
  height = 54,
  onSelectedPointChange,
}: MetricLineChartProps) {
  const [width, setWidth] = useState(0);
  const [chartReady, setChartReady] = useState(false);

  const safeData = data.length > 0 ? data.slice(-DAYS_TO_SHOW) : [0];
  const dataKey = safeData.join("|");

  const days = getLastDays(safeData.length);

  const todayIndex = Math.max(safeData.length - 1, 0);

  const [selectedIndex, setSelectedIndex] = useState(todayIndex);

  useEffect(() => {
    setSelectedIndex(todayIndex);
  }, [todayIndex, dataKey]);

  useEffect(() => {
    if (width <= 0) {
      return;
    }

    setChartReady(false);

    const timer = setTimeout(() => {
      setChartReady(true);
    }, 60);

    return () => clearTimeout(timer);
  }, [width, dataKey]);

  const selectedValue =
    safeData[selectedIndex] ?? safeData[safeData.length - 1];

  const selectedDay = days[selectedIndex] ?? days[days.length - 1];

  const selectedHeaderLabel = selectedDay?.isToday
    ? "Today"
    : `${selectedDay?.shortLabel ?? ""} · ${selectedDay?.dateLabel ?? ""}`;

  useEffect(() => {
    if (!selectedDay) {
      return;
    }

    onSelectedPointChange?.({
      index: selectedIndex,
      value: selectedValue,
      dayLabel: selectedDay.fullLabel,
      dateLabel: selectedDay.dateLabel,
      headerLabel: selectedHeaderLabel,
    });
  }, [
    onSelectedPointChange,
    selectedIndex,
    selectedValue,
    selectedDay?.fullLabel,
    selectedDay?.dateLabel,
    selectedHeaderLabel,
  ]);

  const chartWidth = width > 0 ? Math.max(130, width - 34) : 0;
  const sidePadding = 18;
  const visualMaxValue = getVisualMaxValue(maxValue, safeData);

  const chartData = safeData.map((value, index) => {
    const isSelected = index === selectedIndex;

    return {
      value,
      label: days[index]?.shortLabel ?? "",
      dataPointColor: isSelected ? color : hexToRgba(color, 0.75),
      dataPointRadius: isSelected ? 6 : 4,
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
          height: height + 30,
        },
      ]}
      onLayout={(event) => {
        const nextWidth = Math.floor(event.nativeEvent.layout.width);

        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      {chartWidth > 0 && chartReady && (
        <View style={componentStyles.chartCenter}>
          <LineChart
            key={`metric-line-chart-${chartWidth}-${dataKey}`}
            data={chartData}
            width={chartWidth}
            height={height}
            maxValue={visualMaxValue}
            noOfSections={3}
            curved
            areaChart
            disableScroll
            hideRules
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            color={color}
            thickness={2.4}
            startFillColor={color}
            endFillColor={color}
            startOpacity={0.18}
            endOpacity={0.02}
            initialSpacing={sidePadding}
            endSpacing={sidePadding + 8}
            isAnimated
            animationDuration={850}
            onPress={(_item: unknown, index?: number) => {
              if (typeof index === "number") {
                setSelectedIndex(index);
              }
            }}
            xAxisLabelTextStyle={componentStyles.xAxisLabel}
          />
        </View>
      )}
    </View>
  );
}

function getVisualMaxValue(maxValue: number, data: number[]) {
  const highestDataValue = Math.max(...data);
  const realMaxValue = Math.max(maxValue, highestDataValue);

  if (realMaxValue <= 5) {
    return realMaxValue + 0.6;
  }

  return realMaxValue * 1.1;
}

function getLastDays(count: number): ChartDay[] {
  const today = new Date();

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - 1 - index));

    const isToday = date.toDateString() === today.toDateString();

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
      isToday,
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
    overflow: "visible",
    paddingTop: 4,
    paddingBottom: 12,
    alignItems: "center",
  },

  chartCenter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  xAxisLabel: {
    color: colors.textSoft,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "800",
  },
});
