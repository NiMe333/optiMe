export const startingQuestions = [
  {
    id: "username",
    type: "text",
    question: "What should the application call you?",
    placeholder: "Enter your name",
  },
  {
    id: "education",
    type: "single",
    question: "What is your current education level?",
    options: [
      "Primary school",
      "High school",
      "College / University",
      "Master's degree",
      "PhD",
      "Other",
    ],
  },
  {
    id: "employment",
    type: "single",
    question: "What is your current employment status?",
    options: ["Student", "Employed", "Self-employed", "Unemployed", "Other"],
  },
  {
    id: "mood",
    type: "scale",
    question: "How would you describe your mood?",
    options: [1, 2, 3, 4, 5],
  },
  {
    id: "sleepHours",
    type: "single",
    question: "How many hours do you usually sleep?",
    options: [
      "Excellent · 7-9 hours",
      "Good · 6-7 hours",
      "Fair · 5 hours",
      "Poor · 3-4 hours",
      "Worst · < 3 hours",
    ],
  },
  {
    id: "activity",
    type: "single",
    question: "How active are you during the day?",
    options: ["Very active", "Something in between", "Not at all"],
  },
  {
    id: "socialConnection",
    type: "scale",
    question: "How socially connected do you feel?",
    options: [1, 2, 3, 4, 5],
  },
  {
    id: "phoneScreenTime",
    type: "single",
    question: "How much time do you spend on your phone daily?",
    options: ["6 hours or more", "4-6 hours", "2-4 hours", "<2 hours"],
  },
  {
    id: "stress",
    type: "single",
    question: "How stressed do you feel about work, school, or finances?",
    options: ["Very", "Something in between", "Not at all"],
  },
] as const;

export type StartingQuestion = (typeof startingQuestions)[number];

export type StartingQuestionId = StartingQuestion["id"];

export type FormAnswerValue = string | number;

export type StartingFormAnswers = Partial<
  Record<StartingQuestionId, FormAnswerValue>
>;

export type StartingFormPayload = {
  username: string;
  education: string;
  employment: string;

  baseline: {
    moodScore: number;
    sleepHours: number;
    movementHours: number;
    socialConnectionScore: number;
    lonelinessScore: number;
    screenTimeHours: number;
    financialWorkSchoolStressScore: number;
  };

  formFinished: true;
};

function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return numberValue;
}

export function mapSleepAnswerToHours(answer: unknown) {
  switch (answer) {
    case "Excellent · 7-9 hours":
      return 8;
    case "Good · 6-7 hours":
      return 6.5;
    case "Fair · 5 hours":
      return 5;
    case "Poor · 3-4 hours":
      return 3.5;
    case "Worst · < 3 hours":
      return 2.5;
    default:
      return 0;
  }
}

export function mapActivityAnswerToMovementHours(answer: unknown) {
  switch (answer) {
    case "Very active":
      return 2;
    case "Something in between":
      return 1;
    case "Not at all":
      return 0.25;
    default:
      return 0;
  }
}

export function mapScreenTimeAnswerToHours(answer: unknown) {
  switch (answer) {
    case "6 hours or more":
      return 6.5;
    case "4-6 hours":
      return 5;
    case "2-4 hours":
      return 3;
    case "<2 hours":
      return 1.5;
    default:
      return 0;
  }
}

export function mapStressAnswerToScore(answer: unknown) {
  switch (answer) {
    case "Very":
      return 5;
    case "Something in between":
      return 3;
    case "Not at all":
      return 1;
    default:
      return 0;
  }
}

export function buildStartingFormPayload(
  answers: StartingFormAnswers,
): StartingFormPayload {
  const socialConnectionScore = toNumber(answers.socialConnection);

  return {
    username: String(answers.username ?? "").trim(),
    education: String(answers.education ?? ""),
    employment: String(answers.employment ?? ""),

    baseline: {
      moodScore: toNumber(answers.mood),

      sleepHours: mapSleepAnswerToHours(answers.sleepHours),

      movementHours: mapActivityAnswerToMovementHours(answers.activity),

      socialConnectionScore,

      lonelinessScore:
        socialConnectionScore > 0 ? 6 - socialConnectionScore : 0,

      screenTimeHours: mapScreenTimeAnswerToHours(answers.phoneScreenTime),

      financialWorkSchoolStressScore: mapStressAnswerToScore(answers.stress),
    },

    formFinished: true,
  };
}
