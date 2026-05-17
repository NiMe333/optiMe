import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { colors } from "@/styles/home.styles";

type MetricBarChartProps = {
  data: number[];
  color: string;
  maxValue?: number;
  height?: number;
  unit?: string;
  onSelectedBarChange?: (bar: SelectedBarPoint) => void;
};

export type SelectedBarPoint = {
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

export default function MetricBarChart({
  data,
  color,
  maxValue: _maxValue,
  height = 56,
  unit: _unit = "",
  onSelectedBarChange,
}: MetricBarChartProps) {
  const [width, setWidth] = useState(0);
  const [chartReady, setChartReady] = useState(false);

  const safeData = data.length > 0 ? data.slice(-7) : [0];
  const dataKey = safeData.join("|");

  const days = useMemo(() => getLastDays(safeData.length), [safeData.length]);

  const [selectedIndex, setSelectedIndex] = useState(safeData.length - 1);

  useEffect(() => {
    setSelectedIndex(safeData.length - 1);
  }, [safeData.length]);

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

  useEffect(() => {
    if (!selectedDay) {
      return;
    }

    onSelectedBarChange?.({
      index: selectedIndex,
      value: selectedValue,
      dayLabel: selectedDay.fullLabel,
      dateLabel: selectedDay.dateLabel,
      headerLabel: selectedDay.isToday
        ? "Today"
        : `${selectedDay.shortLabel} · ${selectedDay.dateLabel}`,
    });
  }, [onSelectedBarChange, selectedDay, selectedIndex, selectedValue]);

  const minDataValue = Math.min(...safeData);
  const maxDataValue = Math.max(...safeData);
  const dataRange = maxDataValue - minDataValue;

  const visualBase =
    dataRange > 0 ? dataRange * 0.55 : Math.max(maxDataValue * 0.25, 1);

  const visualMaxValue =
    dataRange > 0 ? dataRange + visualBase : visualBase * 2;

  const paddedVisualMaxValue = visualMaxValue * 1.28;

  function getVisualBarValue(value: number) {
    if (dataRange === 0) {
      return visualBase;
    }

    return value - minDataValue + visualBase;
  }

  const barCount = safeData.length;

  const chartWidth = width > 0 ? Math.max(120, width - 18) : 0;

  const sidePadding = 14;

  const barWidth =
    chartWidth > 0
      ? Math.max(9, Math.min(15, Math.floor(chartWidth / 19)))
      : 11;

  const spacing =
    chartWidth > 0
      ? Math.max(
          4,
          Math.floor(
            (chartWidth - sidePadding * 2 - barWidth * barCount) /
              Math.max(barCount - 1, 1),
          ),
        )
      : 6;

  const chartData = safeData.map((value, index) => {
    const isSelected = index === selectedIndex;
    const isToday = index === safeData.length - 1;

    const selectedBarColor = color;
    const todayBarColor = hexToRgba(color, 0.72);
    const normalBarColor = hexToRgba(color, 0.32);

    const barColor = isSelected
      ? selectedBarColor
      : isToday
        ? todayBarColor
        : normalBarColor;

    return {
      value: getVisualBarValue(value),
      label: days[index]?.shortLabel ?? "",
      frontColor: barColor,
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
          height: height + 28,
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
          <BarChart
            key={`metric-bar-chart-${chartWidth}-${dataKey}`}
            data={chartData}
            width={chartWidth}
            height={height}
            maxValue={paddedVisualMaxValue}
            noOfSections={3}
            disableScroll
            hideRules
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            barWidth={barWidth}
            spacing={spacing}
            roundedTop
            roundedBottom
            initialSpacing={sidePadding}
            endSpacing={sidePadding}
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
