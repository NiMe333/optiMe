import { View, Text } from "react-native";
import { styles } from "@/styles/home.styles";

type MetricValueOnlyProps = {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  hint?: string;
};

export default function MetricValueOnly({
  icon,
  value,
  label,
  color,
  hint,
}: MetricValueOnlyProps) {
  return (
    <View style={styles.metricValueOnlyWrapper}>
      <View style={styles.metricValueOnlyBoxLarge}>
        <View
          style={[
            styles.metricValueOnlyIconBoxLarge,
            { backgroundColor: `${color}18` },
          ]}
        >
          <Text style={[styles.metricValueOnlyIconLarge, { color }]}>
            {icon}
          </Text>
        </View>

        <View>
          <Text style={styles.metricValueOnlyValueLarge}>{value}</Text>
          <Text style={styles.metricValueOnlyLabelLarge}>{label}</Text>
        </View>
      </View>

      {!!hint && <Text style={styles.metricValueOnlyHint}>{hint}</Text>}
    </View>
  );
}
