import { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { colors, styles } from "@/styles/home.styles";

type MetricBarChartProps = {
  data: number[];
  color: string;
  maxValue?: number;
  height?: number;
  unit?: string;
  detailLabel?: string;
};

type ChartDay = {
  shortLabel: string;
  fullLabel: string;
};

export default function MetricBarChart({
  data,
  maxValue,
  height = 50,
  unit = "",
  detailLabel = "Value",
}: MetricBarChartProps) {
  const [width, setWidth] = useState(0);

  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const days = useMemo(() => getLastSevenDays(), []);

  const [selectedIndex, setSelectedIndex] = useState(safeData.length - 1);

  useEffect(() => {
    setSelectedIndex(safeData.length - 1);
  }, [safeData.length]);

  const calculatedMaxValue = maxValue || Math.max(...safeData, 1);

  const barCount = safeData.length;
  const sidePadding = 8;

  const barWidth =
    width > 0 ? Math.max(9, Math.min(16, Math.floor(width / 18))) : 10;

  const spacing =
    width > 0
      ? Math.max(
          6,
          Math.floor(
            (width - sidePadding * 2 - barWidth * barCount) /
              Math.max(barCount - 1, 1),
          ),
        )
      : 8;
  const selectedValue =
    safeData[selectedIndex] ?? safeData[safeData.length - 1];
  const selectedDay = days[selectedIndex] ?? days[days.length - 1];

  const chartData = safeData.map((value, index) => {
    const isSelected = index === selectedIndex;
    const isToday = index === safeData.length - 1;

    const selectedBarColor = colors.purple;
    const todayBarColor = "#B985FF";
    const normalBarColor = hexToRgba(colors.purple, 0.35);

    const barColor = isSelected
      ? selectedBarColor
      : isToday
        ? todayBarColor
        : normalBarColor;

    return {
      value,
      label: days[index]?.shortLabel ?? "",
      frontColor: barColor,
      topLabelComponent: () =>
        isSelected || isToday ? (
          <Text
            style={[
              styles.barChartTopValue,
              {
                color: isSelected ? selectedBarColor : todayBarColor,
              },
            ]}
          >
            {formatChartValue(value, unit)}
          </Text>
        ) : null,
    };
  });

  return (
    <View
      style={{ width: "100%", height: height + 42, overflow: "visible" }}
      onLayout={(event) => {
        const nextWidth = Math.floor(event.nativeEvent.layout.width);

        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      <View style={styles.barChartDetailPill}>
        <Text style={styles.barChartDetailDay}>{selectedDay.fullLabel}</Text>

        <Text style={styles.barChartDetailValue}>
          {detailLabel}: {formatChartValue(selectedValue, unit)}
        </Text>
      </View>

      {width > 0 && (
        <BarChart
          data={chartData}
          width={width}
          height={height}
          maxValue={calculatedMaxValue}
          noOfSections={3}
          disableScroll
          adjustToWidth
          parentWidth={width}
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
          onPress={(_item: unknown, index?: number) => {
            if (typeof index === "number") {
              setSelectedIndex(index);
            }
          }}
          xAxisLabelTextStyle={{
            color: "#6E8092",
            fontSize: 9,
            fontWeight: "800",
          }}
        />
      )}
    </View>
  );
}

function getLastSevenDays(): ChartDay[] {
  const today = new Date();

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      shortLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "narrow",
      }).format(date),
      fullLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date),
    };
  });
}

function formatChartValue(value: number, unit: string) {
  const formattedValue = Number.isInteger(value) ? value : value.toFixed(1);

  return `${formattedValue}${unit}`;
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
