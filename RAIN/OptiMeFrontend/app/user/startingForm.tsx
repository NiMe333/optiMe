import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "@/services/api";
import { startingQuestions } from "@/data/startingQuestions";
import ScaleQuestion from "@/components/questions/ScaleQuestion";
import SingleChoiceQuestion from "@/components/questions/SingleChoiceQuestion";
import ProgressBar from "@/components/questions/ProgressBar";
import { colors, radius, spacing } from "@/constants/theme";

const theme = colors.light;
type Answers = Record<string, string | number>;

export default function StartingForm() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isIntro = currentIndex === -1;
  const isLastQuestion = currentIndex === startingQuestions.length - 1;
  const currentQuestion = isIntro ? null : startingQuestions[currentIndex];
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const handleSelect = (value: string | number) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (isIntro) {
      setCurrentIndex(0);
      return;
    }

    if (selectedAnswer === undefined || selectedAnswer === "") {
      Alert.alert(
        "Missing answer",
        "Please select an answer before continuing.",
      );
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    await submitForm();
  };

  const handleBack = () => {
    if (isSubmitting) return;

    if (currentIndex > -1) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);

      console.log("FORM DATA:", answers);

      const response = await fetch(`${API_URL}/user/startingForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(answers),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "Form submitted successfully.");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to backend.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonDisabled = isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          {isIntro ? (
            <>
              <View style={styles.introTop}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>✓</Text>
                </View>

                <Text style={styles.logo}>optiMe</Text>
                <Text style={styles.subtitle}>A step toward a better you</Text>
              </View>

              <View style={styles.introCenter}>
                <Text style={styles.introEyebrow}>Personal assessment</Text>

                <Text style={styles.introTitle}>
                  Let’s get to know{"\n"}you better
                </Text>

                <Text style={styles.introDescription}>
                  Answer a few quick questions so we can personalize your
                  experience.
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Start assessment</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Pressable
                  onPress={handleBack}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                  ]}
                >
                  <Text style={styles.backText}>‹</Text>
                </Pressable>

                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>Assessment</Text>
                  <Text style={styles.headerSubtitle}>
                    Question {currentIndex + 1} of {startingQuestions.length}
                  </Text>
                </View>

                <View style={styles.progressPill}>
                  <Text style={styles.progressText}>
                    {Math.round(
                      ((currentIndex + 1) / startingQuestions.length) * 100,
                    )}
                    %
                  </Text>
                </View>
              </View>

              <ProgressBar
                current={currentIndex + 1}
                total={startingQuestions.length}
              />

              <View style={styles.content}>
                <Text style={styles.questionNumber}>
                  {String(currentIndex + 1).padStart(2, "0")}
                </Text>

                <Text style={styles.question}>{currentQuestion?.question}</Text>

                {currentQuestion?.type === "scale" ? (
                  <ScaleQuestion
                    options={currentQuestion.options}
                    selected={selectedAnswer as number}
                    onSelect={handleSelect}
                  />
                ) : (
                  <SingleChoiceQuestion
                    options={currentQuestion?.options ?? []}
                    selected={selectedAnswer as string}
                    onSelect={handleSelect}
                  />
                )}
              </View>

              <Pressable
                disabled={buttonDisabled}
                style={({ pressed }) => [
                  styles.button,
                  buttonDisabled && styles.buttonDisabled,
                  pressed && !buttonDisabled && styles.buttonPressed,
                ]}
                onPress={handleNext}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.white} />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLastQuestion ? "Finish" : "Continue"}
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
    padding: spacing.md,
  },
  keyboardView: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },

  introTop: {
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: theme.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  logoText: {
    color: theme.accent,
    fontWeight: "900",
    fontSize: 18,
  },
  logo: {
    color: theme.primary,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 4,
  },

  introCenter: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  introEyebrow: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  introTitle: {
    color: theme.primary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },
  introDescription: {
    color: theme.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: spacing.md,
  },

  header: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  backText: {
    color: theme.white,
    fontSize: 30,
    marginTop: -3,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    color: theme.primary,
    fontWeight: "900",
    fontSize: 15,
  },
  headerSubtitle: {
    color: theme.muted,
    fontSize: 11,
    marginTop: 2,
  },
  progressPill: {
    backgroundColor: theme.primary,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  progressText: {
    color: theme.white,
    fontSize: 11,
    fontWeight: "900",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  questionNumber: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  question: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    color: theme.text,
    letterSpacing: -0.7,
  },

  button: {
    backgroundColor: theme.primary,
    paddingVertical: 17,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonPressed: {
    backgroundColor: theme.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.white,
    fontWeight: "900",
    fontSize: 15,
  },
});
