import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import ScoreDonutChart from "@/components/home/charts/ScoreDonutChart";
import { colors } from "@/styles/home.styles";
import type { HomeDashboardData } from "@/types/home";

type MentalHealthScore = HomeDashboardData["mentalHealthScore"];

type MentalHealthScoreCardProps = {
  score: MentalHealthScore;
  mobile?: boolean;
  onMenuPress?: () => void;
};

const strongShadow =
  Platform.OS === "web"
    ? ({
        boxShadow: "0px 22px 50px rgba(24, 63, 104, 0.16)",
      } as any)
    : {
        shadowColor: colors.shadow,
        shadowOpacity: 0.24,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      };

export default function MentalHealthScoreCard({
  score,
  mobile = false,
  onMenuPress,
}: MentalHealthScoreCardProps) {
  const changeIsPositive = score.changeFromLastWeek >= 0;
  const changeSymbol = changeIsPositive ? "↑" : "↓";
  const absoluteChange = Math.abs(score.changeFromLastWeek);

  return (
    <View
      style={
        mobile ? componentStyles.mobileScoreCard : componentStyles.scoreCard
      }
    >
      <View style={componentStyles.scoreCardHeader}>
        <Text style={componentStyles.scoreCardTitle}>Mental Health Score</Text>

        <Pressable disabled={!onMenuPress} onPress={onMenuPress}>
          <Text style={componentStyles.moreDots}>•••</Text>
        </Pressable>
      </View>

      <ScoreDonutChart
        value={score.value}
        label={score.label}
        status={score.status}
        mobile={mobile}
      />

      <Text style={componentStyles.scoreDescription}>
        Your overall mental{"\n"}health score
      </Text>

      <View style={componentStyles.scoreChangePill}>
        <Text
          style={[
            componentStyles.scoreChangeText,
            { color: changeIsPositive ? colors.green : colors.red },
          ]}
        >
          {changeSymbol} {absoluteChange} pts
        </Text>

        <Text style={componentStyles.scoreChangeMuted}> from last week</Text>
      </View>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  scoreCard: {
    width: 375,
    minHeight: 370,
    borderRadius: 18,
    backgroundColor: colors.navyDark,
    padding: 24,
    ...strongShadow,
  },

  mobileScoreCard: {
    borderRadius: 22,
    backgroundColor: colors.navyDark,
    padding: 22,
    marginBottom: 18,
    ...strongShadow,
  },

  scoreCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreCardTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },

  moreDots: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  scoreDescription: {
    textAlign: "center",
    color: colors.white,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 22,
  },

  scoreChangePill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  scoreChangeText: {
    fontSize: 16,
    fontWeight: "900",
  },

  scoreChangeMuted: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
