import { View, StyleSheet } from "react-native";
import { colors, radius } from "@/constants/theme";

const theme = colors.light;

type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { flex: progress }]} />

      <View style={{ flex: 1 - progress }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: radius.full,
    overflow: "hidden",
    flexDirection: "row",
  },

  fill: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: radius.full,
  },
});
