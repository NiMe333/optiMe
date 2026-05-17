import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { colors } from "@/styles/home.styles";

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
  color,
  maxValue: _maxValue,
  height = 62,
  unit = "",
  detailLabel = "Value",
}: MetricBarChartProps) {
  const [width, setWidth] = useState(0);
  const [chartReady, setChartReady] = useState(false);

  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const dataKey = safeData.join("|");

  const days = useMemo(() => getLastSevenDays(), []);

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

  const minDataValue = Math.min(...safeData);
  const maxDataValue = Math.max(...safeData);
  const dataRange = maxDataValue - minDataValue;

  /**
   * Dinamična skala:
   * - ne rišemo iz 0 do 12
   * - ampak iz dejanskega min/max razpona
   * - dodamo base, da najmanjši stolpec ni neviden
   */
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
  const sidePadding = 8;

  const barWidth =
    width > 0 ? Math.max(10, Math.min(18, Math.floor(width / 16))) : 12;

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
      topLabelComponent: () =>
        isSelected || isToday ? (
          <Text
            style={[
              componentStyles.barChartTopValue,
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
      style={[
        componentStyles.container,
        {
          height: height + 56,
        },
      ]}
      onLayout={(event) => {
        const nextWidth = Math.floor(event.nativeEvent.layout.width);

        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      <View style={componentStyles.barChartDetailPill}>
        <Text style={componentStyles.barChartDetailDay}>
          {selectedDay.fullLabel}
        </Text>

        <Text style={componentStyles.barChartDetailValue}>
          {detailLabel}: {formatChartValue(selectedValue, unit)}
        </Text>
      </View>

      {width > 0 && chartReady && (
        <BarChart
          key={`metric-bar-chart-${width}-${dataKey}`}
          data={chartData}
          width={width}
          height={height}
          maxValue={paddedVisualMaxValue}
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
          isAnimated
          animationDuration={850}
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

function getLastSevenDays(): ChartDay[] {
  const today = new Date();

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      shortLabel: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
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

const componentStyles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "visible",
  },

  barChartDetailPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(24,63,104,0.06)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5,
  },

  barChartDetailDay: {
    color: colors.navy,
    fontSize: 9,
    fontWeight: "900",
  },

  barChartDetailValue: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  barChartTopValue: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 2,
  },

  xAxisLabel: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: "800",
  },
});
