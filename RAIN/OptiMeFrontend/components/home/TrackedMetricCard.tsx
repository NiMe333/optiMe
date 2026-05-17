import { useState, type ReactNode } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/home.styles";
import type { HomeTrackedMetric } from "@/types/home";

import MetricBarChart from "@/components/home/charts/MetricBarChart";
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

  return <LineChartMetric metric={metric} />;
}

function getLineChartDetailLabel(metric: HomeTrackedMetric) {
  if (metric.id === "socialization") {
    return "Social score";
  }

  if (metric.id === "financial-work-school-stress") {
    return "Stress";
  }

  if (metric.id === "self-esteem") {
    return "Self-esteem";
  }

  if (metric.id === "life-satisfaction") {
    return "Life satisfaction";
  }

  return metric.title;
}

function LineChartMetric({ metric }: { metric: HomeTrackedMetric }) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedLinePoint | null>(
    null,
  );

  return (
    <View style={componentStyles.metricBody}>
      <MetricValueHeader
        metric={metric}
        valueLabelOverride={selectedPoint?.headerLabel}
        valueOverride={
          selectedPoint ? formatLineMetricValue(selectedPoint.value) : undefined
        }
      />

      <View style={componentStyles.metricChartBox}>
        <MetricLineChart
          data={metric.chart}
          color={metric.color}
          maxValue={getMetricMaxValue(metric)}
          onSelectedPointChange={setSelectedPoint}
        />
      </View>
    </View>
  );
}

function BarChartMetric({ metric }: { metric: HomeTrackedMetric }) {
  const isScreenTime = metric.id === "screen-time";

  return (
    <View
      style={[
        componentStyles.metricBarBody,
        isScreenTime && componentStyles.screenTimeBarBody,
      ]}
    >
      <View
        style={[
          componentStyles.metricBarTextSide,
          isScreenTime && componentStyles.screenTimeBarTextSide,
        ]}
      >
        {!!metric.valueLabel && (
          <Text style={componentStyles.metricValueLabel}>
            {metric.valueLabel}
          </Text>
        )}

        <View style={componentStyles.metricValueRow}>
          <Text style={componentStyles.metricValue}>{metric.value}</Text>

          {!!metric.suffix && (
            <Text style={componentStyles.metricSuffix}>{metric.suffix}</Text>
          )}
        </View>

        <Text style={componentStyles.metricSubtitle}>{metric.subtitle}</Text>
      </View>

      <View
        style={[
          componentStyles.metricBarChartSide,
          isScreenTime && componentStyles.screenTimeBarChartSide,
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

function MetricValueHeader({
  metric,
  valueLabelOverride,
  valueOverride,
}: {
  metric: HomeTrackedMetric;
  valueLabelOverride?: string;
  valueOverride?: string | number;
}) {
  const valueLabel = valueLabelOverride ?? metric.valueLabel;
  const value = valueOverride ?? metric.value;

  return (
    <View style={componentStyles.metricStatsRow}>
      <View style={componentStyles.metricPrimaryBlock}>
        {!!valueLabel && (
          <Text style={componentStyles.metricValueLabel}>{valueLabel}</Text>
        )}

        <View style={componentStyles.metricValueRow}>
          <Text style={componentStyles.metricValue}>{value}</Text>

          {!!metric.suffix && (
            <Text style={componentStyles.metricSuffix}>{metric.suffix}</Text>
          )}
        </View>

        <Text style={componentStyles.metricSubtitle}>{metric.subtitle}</Text>
      </View>

      {!!metric.secondValue && (
        <View style={componentStyles.metricSecondaryBlock}>
          <Text style={componentStyles.metricSecondaryLabel}>
            {metric.secondLabel || "Second"}
          </Text>

          <Text style={componentStyles.metricSecondaryValue}>
            {metric.secondValue}
          </Text>
        </View>
      )}
    </View>
  );
}

function formatLineMetricValue(value: number) {
  return Number.isInteger(value) ? value : value.toFixed(1);
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

  if (metric.id === "socialization") {
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

const componentStyles = StyleSheet.create({
  metricCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "31%",
    minWidth: 245,
    minHeight: 155,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 16,
    ...cardShadow,
  },

  mobileMetricCard: {
    width: "100%",
    minHeight: 165,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 16,
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

  metricBody: {
    flex: 1,
    marginTop: 8,
  },

  metricStatsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },

  metricPrimaryBlock: {
    flex: 1,
  },

  metricSecondaryBlock: {
    alignItems: "flex-end",
  },

  metricSecondaryLabel: {
    color: colors.navySoft,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 2,
    textTransform: "capitalize",
  },

  metricSecondaryValue: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  metricChartBox: {
    marginTop: 8,
    height: 92,
    width: "100%",
    overflow: "hidden",
  },

  metricValueLabel: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },

  metricValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 1,
  },

  metricValue: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  metricSuffix: {
    color: colors.navySoft,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  metricSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  metricBarBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },

  metricBarTextSide: {
    width: 82,
    justifyContent: "center",
  },

  metricBarChartSide: {
    flex: 1,
    minWidth: 130,
    justifyContent: "center",
  },

  screenTimeBarBody: {
    marginTop: 4,
    alignItems: "center",
  },

  screenTimeBarTextSide: {
    width: 64,
  },

  screenTimeBarChartSide: {
    flex: 1,
    minWidth: 0,
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
