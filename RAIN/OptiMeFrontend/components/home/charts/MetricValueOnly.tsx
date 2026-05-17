import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/home.styles";

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

  const isMoodMetric = !!moodIconName;
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
  }, [progressAnimation, shouldAnimate, trackWidth, value]);

  const progressWidth = (trackWidth * safeProgress) / 100;

  const animatedProgressWidth = shouldAnimate
    ? progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, progressWidth],
      })
    : progressWidth;

  return (
    <View
      style={[
        componentStyles.wrapper,
        isMoodMetric && componentStyles.moodWrapper,
      ]}
    >
      <View
        style={[
          componentStyles.mainRow,
          isMoodMetric && componentStyles.moodMainRow,
        ]}
      >
        <View
          style={[
            componentStyles.info,
            isMoodMetric && componentStyles.moodInfo,
          ]}
        >
          <Text
            style={[
              componentStyles.kicker,
              isMoodMetric && componentStyles.moodKicker,
            ]}
          >
            {statusLabel}
          </Text>

          <View
            style={[
              componentStyles.valueRow,
              isMoodMetric && componentStyles.moodValueRow,
            ]}
          >
            {!!moodIconName && (
              <View
                style={[
                  componentStyles.moodIcon,
                  {
                    backgroundColor: `${color}14`,
                    borderColor: `${color}26`,
                  },
                ]}
              >
                <Ionicons name={moodIconName} size={19} color={color} />
              </View>
            )}

            <Text
              style={[
                componentStyles.valueLarge,
                isMoodMetric && componentStyles.moodValueLarge,
                { color },
              ]}
            >
              {displayValue}
            </Text>
          </View>

          <Text
            style={[
              componentStyles.labelLarge,
              isMoodMetric && componentStyles.moodLabelLarge,
            ]}
          >
            {label}
          </Text>

          {!!hint && (
            <Text
              style={[
                componentStyles.hint,
                isMoodMetric && componentStyles.moodHint,
              ]}
            >
              {hint}
            </Text>
          )}
        </View>

        {!!goalLabel && (
          <View
            style={[
              componentStyles.goalPill,
              {
                backgroundColor: `${color}10`,
                borderColor: `${color}24`,
              },
            ]}
          >
            <Text style={componentStyles.goalLabel}>Goal</Text>

            <Text style={[componentStyles.goalValue, { color }]}>
              {goalLabel}
            </Text>
          </View>
        )}
      </View>

      {showProgress && (
        <View style={componentStyles.progressBlock}>
          <View
            style={componentStyles.progressTrack}
            onLayout={(event) => {
              const nextWidth = event.nativeEvent.layout.width;

              if (nextWidth !== trackWidth) {
                setTrackWidth(nextWidth);
              }
            }}
          >
            <Animated.View
              style={[
                componentStyles.progressFill,
                {
                  width: animatedProgressWidth as any,
                  backgroundColor: color,
                },
              ]}
            />
          </View>

          <Text style={componentStyles.progressText}>
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

const componentStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 8,
    gap: 10,
    justifyContent: "space-between",
  },

  moodWrapper: {
    paddingTop: 10,
    justifyContent: "center",
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  moodMainRow: {
    justifyContent: "center",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  moodInfo: {
    alignItems: "center",
  },

  kicker: {
    color: colors.textSoft,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  moodKicker: {
    alignSelf: "center",
    marginBottom: 12,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  moodValueRow: {
    justifyContent: "center",
    gap: 12,
  },

  moodIcon: {
    width: 34,
    height: 34,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  valueLarge: {
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -0.9,
  },

  moodValueLarge: {
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -0.7,
    textAlign: "center",
  },

  labelLarge: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 0,
  },

  moodLabelLarge: {
    textAlign: "center",
    marginTop: 4,
  },

  hint: {
    color: colors.textSoft,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 9,
  },

  moodHint: {
    textAlign: "center",
    marginTop: 10,
  },

  goalPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    alignSelf: "flex-start",
  },

  goalLabel: {
    color: colors.textSoft,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  goalValue: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
    marginTop: 1,
  },

  progressBlock: {
    gap: 6,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(24, 63, 104, 0.08)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressText: {
    color: colors.textSoft,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
  },
});
