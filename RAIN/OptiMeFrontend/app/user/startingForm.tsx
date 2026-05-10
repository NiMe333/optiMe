import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "@/services/api";
import { startingQuestions } from "@/data/startingQuestions";
import ScaleQuestion from "@/components/questions/ScaleQuestion";
import SingleChoiceQuestion from "@/components/questions/SingleChoiceQuestion";

type Answers = Record<string, string | number>;

export default function StartingForm() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({});

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
    if (currentIndex > -1) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    try {
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
    }
  };

  console.log("STARTING FORM SCREEN LOADED");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        {isIntro ? (
          <>
            <View style={styles.introContent}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>✓</Text>
              </View>

              <Text style={styles.logo}>optiMe</Text>
              <Text style={styles.subtitle}>A step toward a better you</Text>

              <View style={styles.introTextWrapper}>
                <Text style={styles.introTitle}>
                  Let’s get to know{"\n"}you better ...
                </Text>
              </View>
            </View>

            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>

              <Text style={styles.headerTitle}>Assessment</Text>

              <View style={styles.progressPill}>
                <Text style={styles.progressText}>
                  {currentIndex + 1} OF {startingQuestions.length}
                </Text>
              </View>
            </View>

            <View style={styles.content}>
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

            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {isLastQuestion ? "Finish" : "Continue"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderRadius: 28,
    padding: 22,
    justifyContent: "space-between",
  },
  header: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#163B63",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "white",
    fontSize: 26,
    marginTop: -2,
  },
  headerTitle: {
    color: "#163B63",
    fontWeight: "700",
  },
  progressPill: {
    backgroundColor: "#163B63",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  progressText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  question: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#163B63",
  },
  button: {
    backgroundColor: "#163B63",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
  },
  introContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "#7E78F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    color: "#7E78F1",
    fontWeight: "900",
    fontSize: 18,
  },
  logo: {
    color: "#163B63",
    fontSize: 26,
    fontWeight: "900",
  },
  subtitle: {
    color: "#163B63",
    fontSize: 11,
    marginTop: 4,
  },
  introTextWrapper: {
    marginTop: 110,
  },
  introTitle: {
    color: "#163B63",
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
  },
});
