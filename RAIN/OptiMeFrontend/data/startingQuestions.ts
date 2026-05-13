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
