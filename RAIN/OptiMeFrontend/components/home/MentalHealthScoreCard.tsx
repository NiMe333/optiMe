import { Pressable, Text, View } from "react-native";

import ScoreDonutChart from "@/components/home/charts/ScoreDonutChart";
import { colors, styles } from "@/styles/home.styles";
import type { HomeDashboardData } from "@/types/home";

type MentalHealthScore = HomeDashboardData["mentalHealthScore"];

type MentalHealthScoreCardProps = {
  score: MentalHealthScore;
  mobile?: boolean;
  onMenuPress?: () => void;
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
    <View style={mobile ? styles.mobileScoreCard : styles.scoreCard}>
      <View style={styles.scoreCardHeader}>
        <Text style={styles.scoreCardTitle}>Mental Health Score</Text>

        <Pressable disabled={!onMenuPress} onPress={onMenuPress}>
          <Text style={styles.moreDots}>•••</Text>
        </Pressable>
      </View>

      <ScoreDonutChart
        value={score.value}
        label={score.label}
        status={score.status}
        mobile={mobile}
      />

      <Text style={styles.scoreDescription}>
        Your overall mental{"\n"}health score
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

        <Text style={styles.scoreChangeMuted}> from last week</Text>
      </View>
    </View>
  );
}
