import { View, Text } from "react-native";

import { styles } from "@/styles/home.styles";

type MetricValueOnlyProps = {
  value: string | number;
  label: string;
  hint?: string;
  color: string;
  statusLabel?: string;
  progress?: number;
  progressLabel?: string;
  goalLabel?: string;
  showProgress?: boolean;
};

export default function MetricValueOnly({
  value,
  label,
  hint,
  color,
  statusLabel = "Tracked",
  progress = 0,
  progressLabel = "progress",
  goalLabel,
  showProgress = false,
}: MetricValueOnlyProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.metricValueOnlyWrapper}>
      <View style={styles.metricValueOnlyMainRow}>
        <View style={styles.metricValueOnlyInfo}>
          <Text style={styles.metricValueOnlyKicker}>{statusLabel}</Text>

          <Text style={styles.metricValueOnlyValueLarge}>{value}</Text>

          <Text style={styles.metricValueOnlyLabelLarge}>{label}</Text>

          {!!hint && <Text style={styles.metricValueOnlyHint}>{hint}</Text>}
        </View>

        {!!goalLabel && (
          <View
            style={[
              styles.metricValueOnlyGoalPill,
              {
                backgroundColor: `${color}10`,
                borderColor: `${color}24`,
              },
            ]}
          >
            <Text style={styles.metricValueOnlyGoalLabel}>Goal</Text>

            <Text style={[styles.metricValueOnlyGoalValue, { color }]}>
              {goalLabel}
            </Text>
          </View>
        )}
      </View>

      {showProgress && (
        <View style={styles.metricValueOnlyProgressBlock}>
          <View style={styles.metricValueOnlyProgressTrack}>
            <View
              style={[
                styles.metricValueOnlyProgressFill,
                {
                  width: `${safeProgress}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>

          <Text style={styles.metricValueOnlyProgressText}>
            {Math.round(safeProgress)}% {progressLabel}
          </Text>
        </View>
      )}
    </View>
  );
}
