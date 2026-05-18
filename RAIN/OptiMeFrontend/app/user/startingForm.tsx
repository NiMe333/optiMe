import {
  View,
  Text,
  TextInput,
  Animated,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

import { submitStartingForm } from "@/services/auth";
import {
  startingQuestions,
  buildStartingFormPayload,
  type FormAnswerValue,
  type StartingFormAnswers,
} from "@/data/startingQuestions";
import ScaleQuestion from "@/components/questions/ScaleQuestion";
import SingleChoiceQuestion from "@/components/questions/SingleChoiceQuestion";
import ProgressBar from "@/components/questions/ProgressBar";
import { colors } from "@/constants/theme";
import { styles } from "@/styles/startingForm.styles";
import { useToast } from "@/context/ToastContext";
import { Redirect, router } from "expo-router";

const theme = colors.light;

export default function StartingForm() {
  const { showToast } = useToast();
  const { user, authLoading, setUser } = useAuth();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(1)).current;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<StartingFormAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isIntro = currentIndex === -1;
  const isLastQuestion = currentIndex === startingQuestions.length - 1;
  const currentQuestion = isIntro ? null : startingQuestions[currentIndex];

  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const progressValue = isIntro
    ? 0
    : (currentIndex + 1) / startingQuestions.length;

  const canGoBack = currentIndex > 0;
  const buttonDisabled = isSubmitting;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 350,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [progressValue, progressAnim]);

  useEffect(() => {
    questionAnim.setValue(0);

    Animated.timing(questionAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [currentIndex, questionAnim]);

  const logo = Platform.select({
    ios: require("@/assets/images/just_circle.png"),
    android: require("@/assets/images/just_circle.png"),
    web: require("@/assets/images/logo_final_web.svg"),
  });

  const logoStyle = isMobile ? styles.mobileLogo : styles.webLogo;

  const handleSelect = (value: FormAnswerValue) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    if (isIntro) {
      setCurrentIndex(0);
      return;
    }

    if (selectedAnswer === undefined || selectedAnswer === "") {
      showToast("Please select an answer before continuing.", "info");
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

    if (canGoBack) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = buildStartingFormPayload(answers);

      const data = await submitStartingForm(payload);

      if (data.user) {
        setUser(data.user);
      }

      showToast(data.message || "Form submitted successfully.", "success");

      router.replace("/(tabs)/home");
    } catch (error: any) {
      showToast(error.message || "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (user.formFinished === true) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={[styles.form, isMobile && styles.formMobile]}>
            {isIntro ? (
              <>
                <View style={styles.contentWrapper}>
                  <View style={styles.logoSection}>
                    <Image
                      source={logo}
                      style={logoStyle}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.introCenter}>
                    <Text
                      style={[styles.title, isMobile && styles.titleMobile]}
                    >
                      Personal assessment
                    </Text>

                    <Text
                      style={[
                        styles.introTitle,
                        isMobile && styles.introTitleMobile,
                      ]}
                    >
                      Let’s get to know{"\n"}you better
                    </Text>

                    <Text style={styles.introDescription}>
                      Answer a few quick questions so we can personalize your
                      experience.
                    </Text>
                  </View>
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
                    disabled={!canGoBack}
                    onPress={handleBack}
                    style={({ pressed }) => [
                      styles.backButton,
                      !canGoBack && styles.backButtonDisabled,
                      pressed && canGoBack && styles.backButtonPressed,
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
                </View>

                <ProgressBar progress={progressAnim} />

                <Animated.View
                  style={[
                    styles.content,
                    {
                      opacity: questionAnim,
                      transform: [
                        {
                          translateY: questionAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [18, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.questionNumber}>
                    {String(currentIndex + 1).padStart(2, "0")}
                  </Text>

                  <Text
                    style={[styles.question, isMobile && styles.questionMobile]}
                  >
                    {currentQuestion?.question}
                  </Text>

                  <ScrollView
                    style={styles.answersScroll}
                    contentContainerStyle={styles.answersScrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {currentQuestion?.type === "scale" ? (
                      <ScaleQuestion
                        options={currentQuestion.options}
                        selected={selectedAnswer as number}
                        onSelect={handleSelect}
                      />
                    ) : currentQuestion?.type === "text" ? (
                      <TextInput
                        style={styles.textInput}
                        placeholder={currentQuestion.placeholder}
                        placeholderTextColor="#999"
                        value={(selectedAnswer as string) ?? ""}
                        onChangeText={handleSelect}
                        autoCapitalize="words"
                      />
                    ) : (
                      <SingleChoiceQuestion
                        options={currentQuestion?.options ?? []}
                        selected={selectedAnswer as string}
                        onSelect={handleSelect}
                      />
                    )}
                  </ScrollView>
                </Animated.View>
                <View style={styles.footer}>
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
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
