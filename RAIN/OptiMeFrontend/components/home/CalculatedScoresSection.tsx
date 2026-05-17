import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/home.styles";
import type { HomeDashboardData, HomeScoreStatus } from "@/types/home";

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
  return (
    <View
      style={mobile ? componentStyles.mobileSection : componentStyles.section}
    >
      <View style={componentStyles.header}>
        <View>
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

      <View style={mobile ? componentStyles.mobileGrid : componentStyles.grid}>
        {scores.map((score) => (
          <CalculatedScoreCard key={score.id} score={score} mobile={mobile} />
        ))}
      </View>
    </View>
  );
}

function CalculatedScoreCard({
  score,
  mobile = false,
}: {
  score: CalculatedScore;
  mobile?: boolean;
}) {
  const status = score.status ?? getFallbackStatus(score);
  const statusColor = getStatusColor(status);
  const iconName = getScoreIcon(score.id);

  const valueText = String(score.value);
  const levelText = score.level ?? getFallbackLevel(score);

  return (
    <View style={mobile ? componentStyles.mobileCard : componentStyles.card}>
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

      <View style={componentStyles.valueRow}>
        <Text style={[componentStyles.value, { color: score.color }]}>
          {valueText}
        </Text>

        {!!score.suffix && (
          <Text style={componentStyles.suffix}>{score.suffix}</Text>
        )}
      </View>

      <Text style={componentStyles.cardSubtitle}>{score.subtitle}</Text>

      <MiniScoreSparkline data={score.chart} color={score.color} />
    </View>
  );
}

function MiniScoreSparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const safeData = data.length > 0 ? data.slice(-7) : [0];

  const max = Math.max(...safeData);
  const min = Math.min(...safeData);

  return (
    <View style={componentStyles.sparkline}>
      {safeData.map((value, index) => {
        const normalized =
          max === min ? 22 : ((value - min) / (max - min)) * 28 + 10;

        const isLast = index === safeData.length - 1;

        return (
          <View key={`${value}-${index}`} style={componentStyles.sparkColumn}>
            <View
              style={[
                componentStyles.sparkBar,
                {
                  height: normalized,
                  backgroundColor: isLast ? color : hexToRgba(color, 0.32),
                },
              ]}
            />
          </View>
        );
      })}
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

  mobileGrid: {
    gap: 12,
  },

  card: {
    flex: 1,
    minHeight: 150,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    ...softShadow,
  },

  mobileCard: {
    minHeight: 150,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
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
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: 5,
  },

  value: {
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  suffix: {
    color: colors.navySoft,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  cardSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 5,
  },

  sparkline: {
    height: 38,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },

  sparkColumn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  sparkBar: {
    width: 5,
    borderRadius: 999,
  },
});
