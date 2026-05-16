import { Pressable, Text, View } from "react-native";

import { colors, styles } from "@/styles/home.styles";
import type { HomeDashboardData, HomeScoreStatus } from "@/types/home";

type MentalHealthScore = HomeDashboardData["mentalHealthScore"];

type MentalHealthScoreCardProps = {
  score: MentalHealthScore;
  mobile?: boolean;
  onMenuPress?: () => void;
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

export default function MentalHealthScoreCard({
  score,
  mobile = false,
  onMenuPress,
}: MentalHealthScoreCardProps) {
  const scoreColor = getStatusColor(score.status);

  const changeIsPositive = score.changeFromLastWeek >= 0;
  const changeSymbol = changeIsPositive ? "↑" : "↓";
  const absoluteChange = Math.abs(score.changeFromLastWeek);

  return (
    <View style={mobile ? styles.mobileScoreCard : styles.scoreCard}>
      <View style={styles.scoreCardHeader}>
        <Text style={styles.scoreCardTitle}>Mental Health Score</Text>

        <Pressable disabled={!onMenuPress} onPress={onMenuPress}>
          <Text style={styles.moreDots}>•••</Text>
        </Pressable>
      </View>

      <View
        style={[
          mobile ? styles.mobileRing : styles.scoreRing,
          {
            borderTopColor: scoreColor,
            borderRightColor: scoreColor,
          },
        ]}
      >
        <View style={mobile ? styles.mobileRingInner : styles.scoreRingInner}>
          <Text style={mobile ? styles.mobileScoreValue : styles.scoreValue}>
            {score.value}
          </Text>

          <Text style={styles.scoreState}>{score.label}</Text>
        </View>
      </View>

      <Text style={styles.scoreDescription}>
        Composite score from{"\n"}all tracked metrics
      </Text>

      <View style={styles.scoreChangePill}>
        <Text
          style={[
            styles.scoreChangeText,
            { color: changeIsPositive ? colors.green : colors.red },
          ]}
        >
          {changeSymbol} {absoluteChange} pts
        </Text>

        <Text style={styles.scoreChangeMuted}> vs last week</Text>
      </View>
    </View>
  );
}
