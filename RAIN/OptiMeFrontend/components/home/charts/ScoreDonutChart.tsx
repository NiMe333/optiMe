import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import { colors } from "@/styles/home.styles";
import type { HomeScoreStatus } from "@/types/home";

type ScoreDonutChartProps = {
  value: number;
  label: string;
  status: HomeScoreStatus;
  mobile?: boolean;
};

function getStatusColor(status: HomeScoreStatus) {
  switch (status) {
    case "healthy":
      return colors.green;
    case "okay":
      return colors.yellow;
    case "warning":
      return colors.orange;
    case "critical":
      return colors.red;
    default:
      return colors.green;
  }
}

export default function ScoreDonutChart({
  value,
  label,
  status,
  mobile = false,
}: ScoreDonutChartProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const remainingValue = 100 - safeValue;

  const radius = mobile ? 84 : 96;
  const innerRadius = mobile ? 58 : 66;

  const scoreColor = getStatusColor(status);

  const data = [
    {
      value: safeValue,
      color: scoreColor,
    },
    {
      value: remainingValue,
      color: "rgba(255,255,255,0.92)",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <PieChart
        data={data}
        donut
        radius={radius}
        innerRadius={innerRadius}
        innerCircleColor={colors.navyDark}
        showGradient
        isAnimated
        animationDuration={900}
        centerLabelComponent={() => (
          <View style={styles.centerContent}>
            <Text style={mobile ? styles.mobileValue : styles.value}>
              {safeValue}
            </Text>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  value: {
    color: colors.white,
    fontSize: 56,
    fontWeight: "900",
  },

  mobileValue: {
    color: colors.white,
    fontSize: 46,
    fontWeight: "900",
  },

  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
});
