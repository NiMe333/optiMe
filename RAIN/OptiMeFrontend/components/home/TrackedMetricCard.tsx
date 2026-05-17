import type { ReactNode } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, styles } from "@/styles/home.styles";
import type { HomeTrackedMetric } from "@/types/home";

import MetricBarChart from "@/components/home/charts/MetricBarChart";
import MetricLineChart from "@/components/home/charts/MetricLineChart";
import MetricValueOnly from "@/components/home/charts/MetricValueOnly";

type TrackedMetricCardProps = {
  metric: HomeTrackedMetric;
  mobile?: boolean;
};

type MetricVisualType = "bar" | "line" | "value";

export default function TrackedMetricCard({
  metric,
  mobile = false,
}: TrackedMetricCardProps) {
  const visualType = getMetricVisualType(metric);

  return (
    <MetricShell metric={metric} mobile={mobile}>
      {visualType === "value" && <ValueOnlyMetric metric={metric} />}

      {visualType === "bar" && <ChartMetric metric={metric} type="bar" />}

      {visualType === "line" && <ChartMetric metric={metric} type="line" />}
    </MetricShell>
  );
}

function ChartMetric({
  metric,
  type,
}: {
  metric: HomeTrackedMetric;
  type: "bar" | "line";
}) {
  if (type === "bar") {
    return <BarChartMetric metric={metric} />;
  }

  return (
    <View style={styles.metricBody}>
      <MetricValueHeader metric={metric} />

      <View style={styles.metricChartBox}>
        <MetricLineChart
          data={metric.chart}
          color={metric.color}
          maxValue={getMetricMaxValue(metric)}
        />
      </View>
    </View>
  );
}

function BarChartMetric({ metric }: { metric: HomeTrackedMetric }) {
  const isScreenTime = metric.id === "screen-time";

  return (
    <View
      style={[styles.metricBarBody, isScreenTime && styles.screenTimeBarBody]}
    >
      <View
        style={[
          styles.metricBarTextSide,
          isScreenTime && styles.screenTimeBarTextSide,
        ]}
      >
        {!!metric.valueLabel && (
          <Text style={styles.metricValueLabel}>{metric.valueLabel}</Text>
        )}

        <View style={styles.metricValueRow}>
          <Text style={styles.metricValue}>{metric.value}</Text>

          {!!metric.suffix && (
            <Text style={styles.metricSuffix}>{metric.suffix}</Text>
          )}
        </View>

        <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
      </View>

      <View
        style={[
          styles.metricBarChartSide,
          isScreenTime && styles.screenTimeBarChartSide,
        ]}
      >
        <MetricBarChart
          data={metric.chart}
          color={metric.color}
          maxValue={getMetricMaxValue(metric)}
          unit={metric.suffix || ""}
          detailLabel={getBarChartDetailLabel(metric)}
          height={metric.id === "screen-time" ? 76 : 62}
        />
      </View>
    </View>
  );
}

function ValueOnlyMetric({ metric }: { metric: HomeTrackedMetric }) {
  const isActivity =
    metric.id === "movement" ||
    metric.id === "activity" ||
    metric.id === "steps";

  const isMood = metric.id === "mood";

  if (isMood) {
    const moodState = getMoodState(metric.value);

    return (
      <MetricValueOnly
        value={moodState.label}
        label="today mood"
        hint={moodState.description}
        color={moodState.color}
        statusLabel="Entered"
        moodIconName={moodState.iconName}
        showProgress={false}
      />
    );
  }

  const value = metric.suffix
    ? `${metric.value}${metric.suffix}`
    : metric.value;

  const label = isActivity ? "steps today" : metric.subtitle;

  const hint = isActivity ? "Steps from pedometer" : metric.subtitle;

  const statusLabel = isActivity ? "Measured" : "Tracked";

  const progress = getValueMetricProgress(metric);

  const goalLabel = metric.maxValue
    ? formatGoalValue(metric.maxValue)
    : undefined;

  return (
    <MetricValueOnly
      value={value}
      label={label}
      hint={hint}
      color={metric.color}
      statusLabel={statusLabel}
      goalLabel={goalLabel}
      progress={progress}
      progressLabel="of daily goal"
      showProgress={!!metric.maxValue}
    />
  );
}

function MetricValueHeader({ metric }: { metric: HomeTrackedMetric }) {
  return (
    <View style={styles.metricStatsRow}>
      <View style={styles.metricPrimaryBlock}>
        {!!metric.valueLabel && (
          <Text style={styles.metricValueLabel}>{metric.valueLabel}</Text>
        )}

        <View style={styles.metricValueRow}>
          <Text style={styles.metricValue}>{metric.value}</Text>

          {!!metric.suffix && (
            <Text style={styles.metricSuffix}>{metric.suffix}</Text>
          )}
        </View>

        <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
      </View>

      {!!metric.secondValue && (
        <View style={styles.metricSecondaryBlock}>
          <Text style={styles.metricSecondaryLabel}>
            {metric.secondLabel || "Second"}
          </Text>

          <Text style={styles.metricSecondaryValue}>{metric.secondValue}</Text>
        </View>
      )}
    </View>
  );
}

function MetricShell({
  metric,
  mobile,
  children,
}: {
  metric: HomeTrackedMetric;
  mobile: boolean;
  children: ReactNode;
}) {
  const showTrend = metric.id !== "mood";

  const dotColor =
    metric.source === "measured"
      ? colors.blue
      : metric.source === "entered"
        ? colors.green
        : colors.purple;

  const trendSymbol =
    metric.trend.direction === "up"
      ? "↑"
      : metric.trend.direction === "down"
        ? "↓"
        : "→";

  return (
    <View style={mobile ? styles.mobileMetricCard : styles.metricCard}>
      <View style={styles.metricTopRow}>
        <View
          style={[
            styles.metricTitleBadge,
            {
              backgroundColor: `${metric.color}10`,
              borderColor: `${metric.color}24`,
            },
          ]}
        >
          <View
            style={[
              styles.metricIconBox,
              { backgroundColor: `${metric.color}18` },
            ]}
          >
            <MetricHeaderIcon metricId={metric.id} color={metric.color} />
          </View>

          <Text
            style={styles.metricTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {metric.title}
          </Text>

          <View style={[styles.metricDot, { backgroundColor: dotColor }]} />
        </View>

        {showTrend && (
          <View
            style={[
              styles.trendPill,
              metric.trend.isGood ? styles.trendGood : styles.trendBad,
            ]}
          >
            <Text
              style={[
                styles.trendText,
                metric.trend.isGood
                  ? styles.trendTextGood
                  : styles.trendTextBad,
              ]}
            >
              {trendSymbol} {metric.trend.value}%
            </Text>
          </View>
        )}
      </View>

      {children}
    </View>
  );
}

function MetricHeaderIcon({
  metricId,
  color,
}: {
  metricId: string;
  color: string;
}) {
  switch (metricId) {
    case "sleep":
      return <Ionicons name="moon" size={17} color={color} />;

    case "activity":
    case "movement":
    case "steps":
      return <Ionicons name="walk" size={18} color={color} />;

    case "screen-time":
      return <Ionicons name="phone-portrait-outline" size={18} color={color} />;

    case "socialization":
      return <Ionicons name="people-outline" size={18} color={color} />;

    case "mood":
      return <Ionicons name="happy-outline" size={18} color={color} />;

    case "financial-work-school-stress":
      return <Ionicons name="briefcase-outline" size={18} color={color} />;

    default:
      return <Ionicons name="analytics-outline" size={18} color={color} />;
  }
}

function getMetricVisualType(metric: HomeTrackedMetric): MetricVisualType {
  if (
    metric.id === "activity" ||
    metric.id === "movement" ||
    metric.id === "steps" ||
    metric.id === "mood"
  ) {
    return "value";
  }

  if (metric.id === "sleep" || metric.id === "screen-time") {
    return "bar";
  }

  return "line";
}

function getBarChartDetailLabel(metric: HomeTrackedMetric) {
  if (metric.id === "sleep") {
    return "Sleep hours";
  }

  if (metric.id === "screen-time") {
    return "Screen time";
  }

  return metric.title;
}

function getMetricMaxValue(metric: HomeTrackedMetric) {
  if (metric.maxValue) {
    return metric.maxValue;
  }

  if (metric.id === "sleep") {
    return 10;
  }

  if (metric.id === "screen-time") {
    return 12;
  }

  return 100;
}

function getValueMetricProgress(metric: HomeTrackedMetric) {
  if (
    metric.id === "activity" ||
    metric.id === "movement" ||
    metric.id === "steps"
  ) {
    const value = parseMetricNumber(metric.value);
    const goal = metric.maxValue || 10000;

    return clampProgress((value / goal) * 100);
  }

  return 70;
}

function getMoodState(value: string | number) {
  const moodValue = parseMetricNumber(value);

  if (moodValue >= 4.5) {
    return {
      label: "Great",
      description: "You are feeling really good today",
      color: colors.green,
      iconName: "sunny-outline" as keyof typeof Ionicons.glyphMap,
    };
  }

  if (moodValue >= 3.5) {
    return {
      label: "Good",
      description: "Good mood today",
      color: colors.green,
      iconName: "happy-outline" as keyof typeof Ionicons.glyphMap,
    };
  }

  if (moodValue >= 2.5) {
    return {
      label: "Okay",
      description: "A balanced mood today",
      color: colors.yellow,
      iconName: "remove-circle-outline" as keyof typeof Ionicons.glyphMap,
    };
  }

  if (moodValue >= 1.5) {
    return {
      label: "Low",
      description: "Lower mood today",
      color: colors.orange,
      iconName: "cloud-outline" as keyof typeof Ionicons.glyphMap,
    };
  }

  return {
    label: "Very low",
    description: "A difficult mood day",
    color: colors.red,
    iconName: "rainy-outline" as keyof typeof Ionicons.glyphMap,
  };
}

function parseMetricNumber(value: string | number | undefined) {
  if (value === undefined) {
    return 0;
  }

  const cleanValue = String(value).replace(/,/g, "");
  const match = cleanValue.match(/\d+(\.\d+)?/);

  return match ? Number(match[0]) : 0;
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function formatGoalValue(value: number) {
  return value.toLocaleString("en-US");
}
