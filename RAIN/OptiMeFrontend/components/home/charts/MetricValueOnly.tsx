import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  moodIconName?: keyof typeof Ionicons.glyphMap;
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
  moodIconName,
}: MetricValueOnlyProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  const shouldAnimate = showProgress && !moodIconName;

  const progressAnimation = useRef(new Animated.Value(0)).current;

  const [trackWidth, setTrackWidth] = useState(0);
  const [displayValue, setDisplayValue] = useState(String(value));

  useEffect(() => {
    progressAnimation.stopAnimation();

    if (!shouldAnimate) {
      progressAnimation.setValue(1);
      setDisplayValue(String(value));
      return;
    }

    const valueParts = getNumberParts(value);

    progressAnimation.setValue(0);

    if (valueParts) {
      setDisplayValue(formatAnimatedValue(valueParts, 0));
    } else {
      setDisplayValue(String(value));
    }

    if (trackWidth <= 0) {
      return;
    }

    const listenerId = valueParts
      ? progressAnimation.addListener(({ value: animatedValue }) => {
          const nextValue = valueParts.number * animatedValue;
          setDisplayValue(formatAnimatedValue(valueParts, nextValue));
        })
      : undefined;

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setDisplayValue(String(value));
      }
    });

    return () => {
      if (listenerId) {
        progressAnimation.removeListener(listenerId);
      }
    };
  }, [progressAnimation, safeProgress, shouldAnimate, trackWidth, value]);

  const progressWidth = (trackWidth * safeProgress) / 100;

  const animatedProgressWidth = shouldAnimate
    ? progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, progressWidth],
      })
    : progressWidth;

  return (
    <View style={styles.metricValueOnlyWrapper}>
      <View style={styles.metricValueOnlyMainRow}>
        <View style={styles.metricValueOnlyInfo}>
          <Text style={styles.metricValueOnlyKicker}>{statusLabel}</Text>

          <View style={styles.metricValueOnlyMoodRow}>
            {!!moodIconName && (
              <View
                style={[
                  styles.metricValueOnlyMoodIcon,
                  {
                    backgroundColor: `${color}14`,
                    borderColor: `${color}26`,
                  },
                ]}
              >
                <Ionicons name={moodIconName} size={18} color={color} />
              </View>
            )}

            <Text style={[styles.metricValueOnlyValueLarge, { color }]}>
              {displayValue}
            </Text>
          </View>

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
          <View
            style={styles.metricValueOnlyProgressTrack}
            onLayout={(event) => {
              const nextWidth = event.nativeEvent.layout.width;

              if (nextWidth !== trackWidth) {
                setTrackWidth(nextWidth);
              }
            }}
          >
            <Animated.View
              style={[
                styles.metricValueOnlyProgressFill,
                {
                  width: animatedProgressWidth as any,
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

function getNumberParts(value: string | number) {
  const textValue = String(value);
  const match = textValue.match(/-?\d[\d,]*(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const rawNumber = match[0];
  const cleanNumber = rawNumber.replace(/,/g, "");
  const number = Number(cleanNumber);

  if (!Number.isFinite(number)) {
    return null;
  }

  const decimalPlaces = rawNumber.includes(".")
    ? rawNumber.split(".")[1].length
    : 0;

  return {
    number,
    prefix: textValue.slice(0, match.index),
    suffix: textValue.slice((match.index || 0) + rawNumber.length),
    decimalPlaces,
  };
}

function formatAnimatedValue(
  parts: {
    number: number;
    prefix: string;
    suffix: string;
    decimalPlaces: number;
  },
  value: number,
) {
  const formattedNumber =
    parts.decimalPlaces > 0
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: parts.decimalPlaces,
          maximumFractionDigits: parts.decimalPlaces,
        })
      : Math.round(value).toLocaleString("en-US");

  return `${parts.prefix}${formattedNumber}${parts.suffix}`;
}
