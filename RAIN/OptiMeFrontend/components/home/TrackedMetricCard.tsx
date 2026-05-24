import { useState, type ReactNode } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/home.styles";
import type { HomeTrackedMetric } from "@/types/home";

import MetricBarChart, {
  type SelectedBarPoint,
} from "@/components/home/charts/MetricBarChart";

import MetricLineChart, {
  type SelectedLinePoint,
} from "@/components/home/charts/MetricLineChart";

import MetricValueOnly from "@/components/home/charts/MetricValueOnly";

type TrackedMetricCardProps = {
  metric: HomeTrackedMetric;
  mobile?: boolean;
};

type MetricVisualType = "bar" | "line" | "value";

const cardShadow =
  Platform.OS === "web"
    ? ({
        boxShadow: "0px 12px 28px rgba(24, 63, 104, 0.10)",
      } as any)
    : {
        shadowColor: colors.shadow,
        shadowOpacity: 0.14,
        shadowRadius: 16,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        elevation: 3,
      };

export default function TrackedMetricCard({
  metric,
  mobile = false,
}: TrackedMetricCardProps) {
  const visualType = getMetricVisualType(metric);

  return (
    <MetricShell metric={metric} mobile={mobile}>
      {visualType === "value" && <ValueOnlyMetric metric={metric} />}

      {visualType === "bar" && <BarChartMetric metric={metric} />}

      {visualType === "line" && <LineChartMetric metric={metric} />}
    </MetricShell>
  );
}

function BarChartMetric({ metric }: { metric: HomeTrackedMetric }) {
  const [selectedBar, setSelectedBar] = useState<SelectedBarPoint | null>(null);

  const valueLabel = selectedBar?.headerLabel ?? metric.valueLabel ?? "Today";

  const selectedRawValue = selectedBar?.rawValue ?? selectedBar?.value ?? null;

  const value = selectedBar
    ? formatBarMetricValue(selectedRawValue)
    : formatMetricDisplayValue(metric.value);

  const shouldShowSuffix = value !== "No data";

  return (
    <View style={componentStyles.metricBarBody}>
      <CompactMetricHeader
        label={valueLabel}
        value={value}
        suffix={shouldShowSuffix ? metric.suffix : undefined}
        subtitle={metric.subtitle}
      />

      <View style={componentStyles.metricBarChartBottom}>
        <MetricBarChart
          data={metric.chart}
          dates={metric.dates}
          color={metric.color}
          maxValue={getMetricMaxValue(metric)}
          unit={metric.suffix || ""}
          height={metric.id === "screen-time" ? 62 : 56}
          onSelectedBarChange={setSelectedBar}
        />
      </View>
    </View>
  );
}

function LineChartMetric({ metric }: { metric: HomeTrackedMetric }) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedLinePoint | null>(
    null,
  );

  const valueLabel = selectedPoint?.headerLabel ?? metric.valueLabel ?? "Today";

  const selectedRawValue =
    selectedPoint?.rawValue ?? selectedPoint?.value ?? null;

  const value = selectedPoint
    ? formatLineMetricValue(selectedRawValue)
    : formatMetricDisplayValue(metric.value);

  const shouldShowSuffix = value !== "No data";

  return (
    <View style={componentStyles.metricLineBody}>
      <CompactMetricHeader
        label={valueLabel}
        value={value}
        suffix={shouldShowSuffix ? metric.suffix : undefined}
        subtitle={metric.subtitle}
      />

      <View style={componentStyles.metricChartBox}>
        <MetricLineChart
          data={metric.chart}
          dates={metric.dates}
          color={metric.color}
          maxValue={getMetricMaxValue(metric)}
          onSelectedPointChange={setSelectedPoint}
        />
      </View>
    </View>
  );
}

function CompactMetricHeader({
  label,
  value,
  suffix,
  subtitle,
}: {
  label?: string;
  value: string | number | null;
  suffix?: string;
  subtitle: string;
}) {
  return (
    <View style={componentStyles.compactMetricHeader}>
      <View style={componentStyles.compactMetricMainLine}>
        {!!label && (
          <Text
            style={componentStyles.compactMetricLabel}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        )}

        <Text style={componentStyles.compactMetricSeparator}>·</Text>

        <View style={componentStyles.compactMetricValueRow}>
          <Text style={componentStyles.compactMetricValue}>
            {value ?? "No data"}
          </Text>

          {!!suffix && (
            <Text style={componentStyles.compactMetricSuffix}>{suffix}</Text>
          )}
        </View>
      </View>

      <Text style={componentStyles.compactMetricSubtitle}>{subtitle}</Text>
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
        statusLabel={metric.value === null ? "Missing" : "Entered"}
        moodIconName={moodState.iconName}
        showProgress={false}
      />
    );
  }

  const value =
    metric.value === null
      ? "No data"
      : metric.suffix
        ? `${metric.value}${metric.suffix}`
        : metric.value;

  const label = isActivity ? "steps today" : metric.subtitle;

  const hint =
    metric.value === null
      ? "No data for this day"
      : isActivity
        ? "Steps from pedometer"
        : metric.subtitle;

  const statusLabel =
    metric.value === null ? "Missing" : isActivity ? "Measured" : "Tracked";

  const progress = metric.value === null ? 0 : getValueMetricProgress(metric);

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
    <View
      style={
        mobile ? componentStyles.mobileMetricCard : componentStyles.metricCard
      }
    >
      <View style={componentStyles.metricTopRow}>
        <View
          style={[
            componentStyles.metricTitleBadge,
            {
              backgroundColor: `${metric.color}10`,
              borderColor: `${metric.color}24`,
            },
          ]}
        >
          <View
            style={[
              componentStyles.metricIconBox,
              { backgroundColor: `${metric.color}18` },
            ]}
          >
            <MetricHeaderIcon metricId={metric.id} color={metric.color} />
          </View>

          <Text
            style={componentStyles.metricTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {metric.title}
          </Text>

          <View
            style={[componentStyles.metricDot, { backgroundColor: dotColor }]}
          />
        </View>

        {showTrend && (
          <View
            style={[
              componentStyles.trendPill,
              metric.trend.isGood
                ? componentStyles.trendGood
                : componentStyles.trendBad,
            ]}
          >
            <Text
              style={[
                componentStyles.trendText,
                metric.trend.isGood
                  ? componentStyles.trendTextGood
                  : componentStyles.trendTextBad,
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

    case "stress":
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

  if (metric.id === "socialization" || metric.id === "mood") {
    return 5;
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

function getMoodState(value: string | number | null) {
  if (value === null) {
    return {
      label: "No data",
      description: "No mood entry for this day",
      color: colors.textSoft,
      iconName: "help-circle-outline" as keyof typeof Ionicons.glyphMap,
    };
  }

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

function parseMetricNumber(value: string | number | null | undefined) {
  if (value === undefined || value === null) {
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

function formatMetricDisplayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "No data";
  }

  if (typeof value === "string") {
    return value;
  }

  return Number.isInteger(value) ? value : value.toFixed(1);
}

function formatBarMetricValue(value: string | number | null | undefined) {
  return formatMetricDisplayValue(value);
}

function formatLineMetricValue(value: string | number | null | undefined) {
  return formatMetricDisplayValue(value);
}

const componentStyles = StyleSheet.create({
  metricCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "31%",
    minWidth: 245,
    minHeight: 178,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 14,
    overflow: "hidden",
    ...cardShadow,
  },

  mobileMetricCard: {
    width: "100%",
    minHeight: 180,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 14,
    overflow: "hidden",
    ...cardShadow,
  },

  metricTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  metricTitleBadge: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },

  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  metricTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
    flexShrink: 1,
  },

  metricDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },

  metricLineBody: {
    flex: 1,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },

  metricChartBox: {
    marginTop: 4,
    height: 82,
    width: "100%",
    overflow: "hidden",
  },

  compactMetricHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 2,
  },

  compactMetricMainLine: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 5,
  },

  compactMetricLabel: {
    color: colors.navy,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    maxWidth: 120,
  },

  compactMetricSeparator: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    marginBottom: 1,
  },

  compactMetricValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
  },

  compactMetricValue: {
    color: colors.navy,
    fontSize: 21,
    lineHeight: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  compactMetricSuffix: {
    color: colors.navySoft,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  compactMetricSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    marginTop: 0,
    textAlign: "center",
  },

  metricBarBody: {
    flex: 1,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },

  metricBarChartBottom: {
    width: "80%",
    maxWidth: 230,
    minWidth: 165,
    alignSelf: "center",
    overflow: "visible",
  },

  trendPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },

  trendGood: {
    backgroundColor: colors.greenSoft,
  },

  trendBad: {
    backgroundColor: colors.redSoft,
  },

  trendText: {
    fontSize: 11,
    fontWeight: "900",
  },

  trendTextGood: {
    color: colors.green,
  },

  trendTextBad: {
    color: colors.red,
  },
});
