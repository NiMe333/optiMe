import type {
  HomeDashboardData,
  HomeScoreStatus,
  HomeTrendDirection,
  NullableNumber,
} from "@/types/home";

const DAYS_TO_SHOW = 7;

const homeColors = {
  blue: "#2D7EF7",
  blueSoft: "#EAF4FF",
  green: "#19B88A",
  greenSoft: "#E8F8F2",
  purple: "#8B3DDB",
  purpleSoft: "#F1E8FF",
  orange: "#FF8A3D",
  orangeSoft: "#FFF2E9",
  pink: "#EE4D8B",
  pinkSoft: "#FFEAF3",
  yellow: "#F6B62D",
  yellowSoft: "#FFF8E6",
};

const hardcodedAchievements: HomeDashboardData["achievements"] = [
  {
    id: "sleep-balance",
    title: "Sleep Balance",
    streak: "7-day streak",
    completed: true,
  },
  {
    id: "active-mind",
    title: "Active Mind",
    streak: "5-day streak",
    completed: true,
  },
  {
    id: "digital-detox",
    title: "Digital Detox",
    streak: "3-day streak",
    completed: true,
  },
  {
    id: "inner-balance",
    title: "Inner Balance",
    streak: "10-day streak",
    completed: true,
  },
];

const hardcodedArticles: HomeDashboardData["articles"] = [
  {
    id: "screen-time-mind",
    category: "MENTAL HEALTH",
    title: "The Hidden Impact of Screen Time on Your Mind",
    readTime: "5 min read",
    color: homeColors.purpleSoft,
  },
  {
    id: "better-sleep",
    category: "SLEEP",
    title: "Better Sleep, Better Mind: Simple Changes",
    readTime: "4 min read",
    color: homeColors.blueSoft,
  },
  {
    id: "breathing-mood",
    category: "MINDFULNESS",
    title: "How Breathing Changes Your Mood",
    readTime: "3 min read",
    color: homeColors.purpleSoft,
  },
  {
    id: "calmer-workday",
    category: "PRODUCTIVITY",
    title: "Small Habits for a Calmer Workday",
    readTime: "3 min read",
    color: homeColors.orangeSoft,
  },
  {
    id: "social-connections",
    category: "RELATIONSHIPS",
    title: "Building Stronger Social Connections",
    readTime: "4 min read",
    color: homeColors.pinkSoft,
  },
  {
    id: "weekend-reset",
    category: "SELF-CARE",
    title: "Weekend Reset: Recharge Your Mind and Body",
    readTime: "5 min read",
    color: homeColors.greenSoft,
  },
];

function normalizeScoreStatus(status: unknown): HomeScoreStatus {
  if (
    status === "healthy" ||
    status === "okay" ||
    status === "warning" ||
    status === "critical"
  ) {
    return status;
  }

  if (status === "danger") {
    return "critical";
  }

  return "warning";
}

function normalizeTrendDirection(direction: unknown): HomeTrendDirection {
  if (direction === "up" || direction === "down" || direction === "same") {
    return direction;
  }

  return "same";
}

const emptyTrend: {
  direction: HomeTrendDirection;
  value: number;
  isGood: boolean;
} = {
  direction: "same",
  value: 0,
  isGood: true,
};

const trackedMetricUiConfig: Record<string, any> = {
  sleep: {
    id: "sleep",
    title: "Sleep",
    variant: "average",
    source: "measured",
    valueLabel: "Last night",
    suffix: "h",
    subtitle: "Sleep hours",
    color: homeColors.purple,
  },

  activity: {
    id: "activity",
    title: "Activity",
    variant: "double",
    source: "measured",
    valueLabel: "Today",
    subtitle: "Steps from pedometer",
    maxValue: 8000,
    color: homeColors.green,
  },

  "screen-time": {
    id: "screen-time",
    title: "Screen Time",
    variant: "average",
    source: "measured",
    valueLabel: "Today",
    suffix: "h",
    subtitle: "Device screen time",
    color: homeColors.orange,
  },

  socialization: {
    id: "socialization",
    title: "Socialization",
    variant: "score",
    source: "entered",
    valueLabel: "Social score",
    suffix: "/5",
    subtitle: "Social connection",
    maxValue: 5,
    color: homeColors.purple,
  },

  mood: {
    id: "mood",
    title: "Mood",
    variant: "score",
    source: "entered",
    valueLabel: "Today",
    suffix: "/5",
    subtitle: "Mood check-in",
    maxValue: 5,
    color: homeColors.yellow,
  },

  stress: {
    id: "stress",
    title: "Stress",
    variant: "score",
    source: "entered",
    valueLabel: "Financial / Work / School",
    suffix: "/5",
    subtitle: "Baseline stress level",
    maxValue: 5,
    color: homeColors.pink,
  },
};

const calculatedScoreUiConfig: Record<string, any> = {
  "anxiety-signals": {
    id: "anxiety-signals",
    title: "Anxiety Signals",
    suffix: "/100",
    subtitle: "Based on recent patterns",
    color: homeColors.purple,
  },

  "stress-level": {
    id: "stress-level",
    title: "Stress Level",
    subtitle: "Work, school and daily pressure",
    color: homeColors.orange,
  },

  "mood-balance": {
    id: "mood-balance",
    title: "Mood Balance",
    suffix: "/100",
    subtitle: "Mood, sleep and social signals",
    color: homeColors.green,
  },
};

const trendUiConfig: Record<string, any> = {
  sleep: {
    id: "sleep",
    label: "Sleep (hrs)",
    color: homeColors.purple,
  },

  movement: {
    id: "movement",
    label: "Movement (steps)",
    color: homeColors.green,
  },

  "social-score": {
    id: "social-score",
    label: "Social Score",
    color: homeColors.blue,
  },

  "stress-level": {
    id: "stress-level",
    label: "Stress Level",
    color: homeColors.pink,
  },

  "screen-time": {
    id: "screen-time",
    label: "Screen Time (hrs)",
    color: homeColors.orange,
  },
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultDates() {
  const today = new Date();

  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - index));

    return getDateKey(date);
  });
}

function getTodayKey() {
  return getDateKey(new Date());
}

function normalizeDates(dates?: unknown) {
  if (!Array.isArray(dates)) {
    return getDefaultDates();
  }

  const normalizedDates = dates.filter(
    (date): date is string => typeof date === "string",
  );

  if (normalizedDates.length === 0) {
    return getDefaultDates();
  }

  return normalizedDates.slice(-DAYS_TO_SHOW);
}

function normalizeNullableNumber(value: unknown): NullableNumber {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeRequiredNumber(value: unknown) {
  return normalizeNullableNumber(value) ?? 0;
}

function normalizeDisplayValue(value: unknown): string | number | null {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  return normalizeNullableNumber(value);
}

function normalizeChartByDate(
  chart: unknown,
  dates: string[],
): NullableNumber[] {
  const targetLength = dates.length;

  if (!Array.isArray(chart)) {
    return Array(targetLength).fill(null);
  }

  const values = chart.map(normalizeNullableNumber);

  if (values.length === targetLength) {
    return values;
  }

  if (values.length > targetLength) {
    return values.slice(-targetLength);
  }

  const missingCount = targetLength - values.length;

  return [...Array(missingCount).fill(null), ...values];
}

function normalizeTrendObject(trend: any): {
  direction: HomeTrendDirection;
  value: number;
  isGood: boolean;
} {
  if (!trend) {
    return emptyTrend;
  }

  return {
    direction: normalizeTrendDirection(trend.direction),
    value: normalizeRequiredNumber(trend.value),
    isGood: typeof trend.isGood === "boolean" ? trend.isGood : true,
  };
}

function formatSteps(value: unknown) {
  const numberValue = normalizeNullableNumber(value);

  if (numberValue === null) {
    return null;
  }

  return numberValue.toLocaleString("en-US");
}

function getResponseData<T>(result: PromiseSettledResult<any>): T | null {
  if (result.status !== "fulfilled") {
    return null;
  }

  return result.value?.data ?? null;
}

function createEmptyMentalHealthScore(
  date = getTodayKey(),
): HomeDashboardData["mentalHealthScore"] {
  return {
    value: null,
    label: "No data",
    status: "warning",
    changeFromLastWeek: null,
    date,
  };
}

function normalizeMentalHealthScore(
  score: any,
  date = getTodayKey(),
): HomeDashboardData["mentalHealthScore"] {
  if (!score) {
    return createEmptyMentalHealthScore(date);
  }

  return {
    value: normalizeNullableNumber(score.value),
    label: typeof score.label === "string" ? score.label : "No data",
    status: normalizeScoreStatus(score.status),
    changeFromLastWeek: normalizeNullableNumber(score.changeFromLastWeek),
    date: typeof score.date === "string" ? score.date : date,
  };
}

function createEmptyTrackedMetric(
  id: string,
  dates = getDefaultDates(),
): HomeDashboardData["trackedMetrics"][number] {
  const config = trackedMetricUiConfig[id];

  return {
    ...config,
    value: null,
    trend: emptyTrend,
    chart: Array(dates.length).fill(null),
    dates,
  };
}

function normalizeTrackedMetric(
  metric: any,
  fallbackDates = getDefaultDates(),
): HomeDashboardData["trackedMetrics"][number] {
  const id = metric?.id;
  const config = trackedMetricUiConfig[id] ?? {};
  const dates = normalizeDates(metric?.dates ?? fallbackDates);

  const rawValue = normalizeNullableNumber(metric?.value);

  const normalizedMetric: HomeDashboardData["trackedMetrics"][number] = {
    ...config,
    ...metric,
    value: rawValue,
    trend: normalizeTrendObject(metric?.trend),
    chart: normalizeChartByDate(metric?.chart, dates),
    dates,
  };

  if (id === "activity") {
    normalizedMetric.value = formatSteps(rawValue);
  }

  return normalizedMetric;
}

function createEmptyTrackedMetrics(dates = getDefaultDates()) {
  return Object.keys(trackedMetricUiConfig).map((id) =>
    createEmptyTrackedMetric(id, dates),
  );
}

function createEmptyCalculatedScore(
  id: string,
  dates = getDefaultDates(),
): HomeDashboardData["calculatedScores"][number] {
  const config = calculatedScoreUiConfig[id];

  return {
    ...config,
    value: null,
    level: "No data",
    status: "warning",
    chart: Array(dates.length).fill(null),
    dates,
  };
}

function normalizeCalculatedScore(
  score: any,
  fallbackDates = getDefaultDates(),
): HomeDashboardData["calculatedScores"][number] {
  const id = score?.id;
  const config = calculatedScoreUiConfig[id] ?? {};
  const dates = normalizeDates(score?.dates ?? fallbackDates);

  return {
    ...config,
    ...score,
    value: normalizeDisplayValue(score?.value),
    level: typeof score?.level === "string" ? score.level : "No data",
    status: normalizeScoreStatus(score?.status),
    chart: normalizeChartByDate(score?.chart, dates),
    dates,
  };
}

function createEmptyCalculatedScores(dates = getDefaultDates()) {
  return Object.keys(calculatedScoreUiConfig).map((id) =>
    createEmptyCalculatedScore(id, dates),
  );
}

function createEmptyTrend(
  id: string,
  dates = getDefaultDates(),
): HomeDashboardData["trends"][number] {
  const config = trendUiConfig[id];

  return {
    ...config,
    data: Array(dates.length).fill(null),
    dates,
  };
}

function normalizeTrend(
  trend: any,
  fallbackDates = getDefaultDates(),
): HomeDashboardData["trends"][number] {
  const id = trend?.id;
  const config = trendUiConfig[id] ?? {};
  const dates = normalizeDates(trend?.dates ?? fallbackDates);

  return {
    ...config,
    ...trend,
    data: normalizeChartByDate(trend?.data, dates),
    dates,
  };
}

function createEmptyTrends(dates = getDefaultDates()) {
  return Object.keys(trendUiConfig).map((id) => createEmptyTrend(id, dates));
}

function createEmptyHomeDashboardData(
  dates = getDefaultDates(),
): HomeDashboardData {
  return {
    user: {
      username: "",
      gender: "",
      dateOfBirth: "",
      education: "",
      employment: "",
    },

    mentalHealthScore: createEmptyMentalHealthScore(),

    trackedMetrics: createEmptyTrackedMetrics(dates),

    calculatedScores: createEmptyCalculatedScores(dates),

    trends: createEmptyTrends(dates),

    achievements: hardcodedAchievements,

    articles: hardcodedArticles,
  };
}

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const defaultDates = getDefaultDates();

  try {
    const api = await import("@/services/apiI");

    const [
      mentalHealthResult,
      trackedMetricsResult,
      calculatedScoresResult,
      trendsResult,
    ] = await Promise.allSettled([
      api.default.get("/data/mentalHealthScore"),
      api.default.get("/data/trackedMetrics"),
      api.default.get("/data/calculatedScores"),
      api.default.get("/data/trends"),
    ]);

    const mentalHealthData = getResponseData<any>(mentalHealthResult);

    const trackedMetricsData = getResponseData<any>(trackedMetricsResult);

    const calculatedScoresData = getResponseData<any>(calculatedScoresResult);

    const trendsData = getResponseData<any>(trendsResult);

    const dates = normalizeDates(
      trackedMetricsData?.dates ??
        trendsData?.dates ??
        calculatedScoresData?.dates ??
        mentalHealthData?.dates ??
        defaultDates,
    );

    const mentalHealthScore = normalizeMentalHealthScore(
      mentalHealthData?.mentalHealthScore,
      getTodayKey(),
    );

    const trackedMetrics = Array.isArray(trackedMetricsData?.trackedMetrics)
      ? trackedMetricsData.trackedMetrics.map((metric: any) =>
          normalizeTrackedMetric(metric, dates),
        )
      : createEmptyTrackedMetrics(dates);

    const calculatedScores = Array.isArray(
      calculatedScoresData?.calculatedScores,
    )
      ? calculatedScoresData.calculatedScores.map((score: any) =>
          normalizeCalculatedScore(score, dates),
        )
      : createEmptyCalculatedScores(dates);

    const trends = Array.isArray(trendsData?.trends)
      ? trendsData.trends.map((trend: any) => normalizeTrend(trend, dates))
      : createEmptyTrends(dates);

    return {
      user: {
        username: "",
        gender: "",
        dateOfBirth: "",
        education: "",
        employment: "",
      },

      mentalHealthScore,

      trackedMetrics,

      calculatedScores,

      trends,

      achievements: hardcodedAchievements,

      articles: hardcodedArticles,
    };
  } catch {
    return createEmptyHomeDashboardData(defaultDates);
  }
}
