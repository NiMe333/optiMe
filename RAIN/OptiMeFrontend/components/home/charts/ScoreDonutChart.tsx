import { useEffect, useState } from "react";
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

export default function ScoreDonutChart({
  value,
  label,
  status,
  mobile = false,
}: ScoreDonutChartProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const [animatedValue, setAnimatedValue] = useState(0);

  const radius = mobile ? 92 : 110;
  const innerRadius = mobile ? 64 : 78;

  const scoreColor = getStatusColor(status);

  useEffect(() => {
    let animationFrame: number;

    const duration = 1000;
    const startTime = Date.now();

    setAnimatedValue(0);

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const nextValue = Math.round(safeValue * easedProgress);

      setAnimatedValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [safeValue]);

  const remainingValue = 100 - animatedValue;

  const data = [
    {
      value: animatedValue,
      color: scoreColor,
    },
    {
      value: remainingValue,
      color: "rgba(255,255,255,0.92)",
    },
  ];

  return (
    <View style={componentStyles.wrapper}>
      <PieChart
        data={data}
        donut
        radius={radius}
        innerRadius={innerRadius}
        innerCircleColor={colors.navyDark}
        showGradient
        centerLabelComponent={() => (
          <View style={componentStyles.centerContent}>
            <Text
              style={
                mobile ? componentStyles.mobileValue : componentStyles.value
              }
            >
              {animatedValue}
            </Text>

            <Text style={componentStyles.label}>{label}</Text>
          </View>
        )}
      />
    </View>
  );
}

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

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

const componentStyles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
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
