import { View, Text } from "react-native";
import { styles } from "@/styles/home.styles";

type MetricValueOnlyProps = {
  value: string | number;
  label: string;
  hint?: string;
};

export default function MetricValueOnly({
  value,
  label,
  hint,
}: MetricValueOnlyProps) {
  return (
    <View style={styles.metricValueOnlyWrapper}>
      <View style={styles.metricValueOnlyBoxLarge}>
        <View>
          <Text style={styles.metricValueOnlyValueLarge}>{value}</Text>
          <Text style={styles.metricValueOnlyLabelLarge}>{label}</Text>
        </View>
      </View>

      {!!hint && <Text style={styles.metricValueOnlyHint}>{hint}</Text>}
    </View>
  );
}
