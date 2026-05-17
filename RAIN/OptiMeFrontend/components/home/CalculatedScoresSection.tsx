import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { colors } from "@/styles/home.styles";
import type { HomeDashboardData, HomeScoreStatus } from "@/types/home";

import MetricBarChart, {
  type SelectedBarPoint,
} from "@/components/home/charts/MetricBarChart";

type CalculatedScore = HomeDashboardData["calculatedScores"][number];

type CalculatedScoresSectionProps = {
  scores: CalculatedScore[];
  mobile?: boolean;
};

const softShadow =
  Platform.OS === "web"
    ? ({
        boxShadow: "0px 16px 38px rgba(24, 63, 104, 0.10)",
      } as any)
    : {
        shadowColor: colors.shadow,
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      };

export default function CalculatedScoresSection({
  scores,
  mobile = false,
}: CalculatedScoresSectionProps) {
  const { width } = useWindowDimensions();

  const mobileCardWidth = Math.min(width - 66, 330);

  return (
    <View
      style={mobile ? componentStyles.mobileSection : componentStyles.section}
    >
      <View style={componentStyles.header}>
        <View style={componentStyles.headerTextBlock}>
          <Text style={componentStyles.title}>Calculated Scores</Text>
          <Text style={componentStyles.subtitle}>
            Estimated from your recent patterns
          </Text>
        </View>

        <View style={componentStyles.infoPill}>
          <Ionicons name="sparkles-outline" size={14} color={colors.navySoft} />
          <Text style={componentStyles.infoText}>Auto</Text>
        </View>
      </View>

      {mobile ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={mobileCardWidth + 14}
          snapToAlignment="start"
          contentContainerStyle={componentStyles.mobileScrollContent}
        >
          {scores.map((score) => (
            <CalculatedScoreCard
              key={score.id}
              score={score}
              mobile
              width={mobileCardWidth}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={componentStyles.grid}>
          {scores.map((score) => (
            <CalculatedScoreCard key={score.id} score={score} />
          ))}
        </View>
      )}
    </View>
  );
}

function CalculatedScoreCard({
  score,
  mobile = false,
  width,
}: {
  score: CalculatedScore;
  mobile?: boolean;
  width?: number;
}) {
  const [selectedBar, setSelectedBar] = useState<SelectedBarPoint | null>(null);

  const status = score.status ?? getFallbackStatus(score);
  const statusColor = getStatusColor(status);
  const iconName = getScoreIcon(score.id);

  const levelText = score.level ?? getFallbackLevel(score);

  const headerLabel = selectedBar?.headerLabel ?? "Today";

  const displayValue = selectedBar
    ? formatScoreValue(selectedBar.value)
    : String(score.value);

  const displaySuffix = getScoreSuffix(score);

  return (
    <View
      style={[
        mobile ? componentStyles.mobileCard : componentStyles.card,
        mobile && width ? { width } : null,
      ]}
    >
      <View style={componentStyles.cardTopRow}>
        <View
          style={[
            componentStyles.iconBox,
            {
              backgroundColor: `${score.color}14`,
              borderColor: `${score.color}24`,
            },
          ]}
        >
          <Ionicons name={iconName} size={18} color={score.color} />
        </View>

        <View
          style={[
            componentStyles.levelPill,
            {
              backgroundColor: `${statusColor}14`,
            },
          ]}
        >
          <Text style={[componentStyles.levelText, { color: statusColor }]}>
            {levelText}
          </Text>
        </View>
      </View>

      <Text style={componentStyles.cardTitle}>{score.title}</Text>

      <View style={componentStyles.valueLine}>
        <Text
          style={componentStyles.valueDate}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {headerLabel}
        </Text>

        <Text style={componentStyles.valueSeparator}>·</Text>

        <View style={componentStyles.valueRow}>
          <Text style={[componentStyles.value, { color: score.color }]}>
            {displayValue}
          </Text>

          {!!displaySuffix && (
            <Text style={componentStyles.suffix}>{displaySuffix}</Text>
          )}
        </View>
      </View>

      <Text style={componentStyles.cardSubtitle}>{score.subtitle}</Text>

      <View style={componentStyles.chartBox}>
        <MetricBarChart
          data={score.chart}
          color={score.color}
          maxValue={100}
          unit={displaySuffix}
          height={48}
          onSelectedBarChange={setSelectedBar}
        />
      </View>
    </View>
  );
}

function getScoreIcon(id: string): keyof typeof Ionicons.glyphMap {
  switch (id) {
    case "anxiety-signals":
      return "pulse-outline";

    case "stress-level":
      return "flash-outline";

    case "mood-balance":
      return "leaf-outline";

    default:
      return "analytics-outline";
  }
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

function getFallbackStatus(score: CalculatedScore): HomeScoreStatus {
  if (typeof score.value === "number") {
    if (score.value >= 75) {
      return "healthy";
    }

    if (score.value >= 50) {
      return "okay";
    }

    if (score.value >= 30) {
      return "warning";
    }

    return "critical";
  }

  if (String(score.value).toLowerCase().includes("moderate")) {
    return "warning";
  }

  return "okay";
}

function getFallbackLevel(score: CalculatedScore) {
  if (typeof score.value !== "number") {
    return String(score.value);
  }

  if (score.value >= 75) {
    return "Stable";
  }

  if (score.value >= 50) {
    return "Okay";
  }

  if (score.value >= 30) {
    return "Moderate";
  }

  return "Needs care";
}

function getScoreSuffix(score: CalculatedScore) {
  if (score.suffix) {
    return score.suffix;
  }

  if (score.id === "stress-level") {
    return "/100";
  }

  return "";
}

function formatScoreValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const componentStyles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  mobileSection: {
    marginTop: 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
    marginTop: 14,
  },

  headerTextBlock: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(24,63,104,0.06)",
  },

  infoText: {
    color: colors.navySoft,
    fontSize: 11,
    fontWeight: "900",
  },

  grid: {
    flexDirection: "row",
    gap: 12,
  },

  mobileScrollContent: {
    gap: 14,
    paddingRight: 18,
    paddingBottom: 8,
  },

  card: {
    flex: 1,
    minHeight: 190,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    overflow: "hidden",
    ...softShadow,
  },

  mobileCard: {
    minHeight: 240,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    overflow: "hidden",
    ...softShadow,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  levelPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  levelText: {
    fontSize: 10,
    fontWeight: "900",
  },

  cardTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },

  valueLine: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 5,
  },

  valueDate: {
    color: colors.navy,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    maxWidth: 92,
    flexShrink: 1,
  },

  valueSeparator: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    marginBottom: 1,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    flexShrink: 0,
  },

  value: {
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  suffix: {
    color: colors.navySoft,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  cardSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  chartBox: {
    width: "82%",
    maxWidth: 220,
    minWidth: 155,
    alignSelf: "center",
    marginTop: 14,
    overflow: "visible",
  },
});
