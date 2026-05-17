import type { ReactNode } from "react";
import { View, Text } from "react-native";

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
  return (
    <View style={styles.metricBody}>
      <MetricValueHeader metric={metric} />

      <View style={styles.metricChartBox}>
        {type === "bar" ? (
          <MetricBarChart
            data={metric.chart}
            color={metric.color}
            maxValue={getMetricMaxValue(metric)}
          />
        ) : (
          <MetricLineChart
            data={metric.chart}
            color={metric.color}
            maxValue={getMetricMaxValue(metric)}
          />
        )}
      </View>
    </View>
  );
}

function ValueOnlyMetric({ metric }: { metric: HomeTrackedMetric }) {
  const isActivity = metric.id === "movement" || metric.id === "activity";
  const isMood = metric.id === "mood";

  const value = metric.suffix
    ? `${metric.value}${metric.suffix}`
    : metric.value;

  const label = isActivity
    ? "steps today"
    : isMood
      ? "today mood"
      : metric.subtitle;

  const icon = isActivity ? "👟" : isMood ? "🙂" : metric.icon;

  return (
    <MetricValueOnly
      icon={icon}
      value={value}
      label={label}
      color={metric.color}
      hint={metric.subtitle}
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
        <View style={styles.metricTitleBlock}>
          <Text style={[styles.metricIcon, { color: metric.color }]}>
            {metric.icon}
          </Text>

          <View style={styles.metricTextBlock}>
            <View style={styles.metricTitleRow}>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <View style={[styles.metricDot, { backgroundColor: dotColor }]} />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.trendPill,
            metric.trend.isGood ? styles.trendGood : styles.trendBad,
          ]}
        >
          <Text
            style={[
              styles.trendText,
              metric.trend.isGood ? styles.trendTextGood : styles.trendTextBad,
            ]}
          >
            {trendSymbol} {metric.trend.value}%
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
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
