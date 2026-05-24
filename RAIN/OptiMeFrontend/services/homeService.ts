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
  source: string,
): NullableNumber[] {
  const targetLength = dates.length;

  if (!Array.isArray(chart)) {
    console.log(
      `[HOME DATA] ${source}: backend did not return chart/data array`,
    );

    return Array(targetLength).fill(null);
  }

  const values = chart.map(normalizeNullableNumber);

  let normalizedValues: NullableNumber[];

  if (values.length === targetLength) {
    normalizedValues = values;
  } else if (values.length > targetLength) {
    normalizedValues = values.slice(-targetLength);

    console.log(`[HOME DATA] ${source}: backend returned too many values`, {
      received: values.length,
      expected: targetLength,
      usedValues: normalizedValues,
    });
  } else {
    const missingCount = targetLength - values.length;

    normalizedValues = [...Array(missingCount).fill(null), ...values];

    console.log(`[HOME DATA] ${source}: backend returned too few values`, {
      received: values.length,
      expected: targetLength,
      paddedWithNullAtStart: missingCount,
    });
  }

  console.table(
    dates.map((date, index) => ({
      source,
      date,
      value: normalizedValues[index],
    })),
  );

  normalizedValues.forEach((value, index) => {
    if (value === null) {
      console.log(`[HOME DATA] Missing value for ${source} on ${dates[index]}`);
    }
  });

  return normalizedValues;
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

function getResponseData<T>(
  result: PromiseSettledResult<any>,
  key: string,
): T | null {
  if (result.status !== "fulfilled") {
    console.log(`[HOME DATA] ${key} request failed:`, {
      message: result.reason?.message,
      status: result.reason?.response?.status,
      data: result.reason?.response?.data,
      url: result.reason?.config?.url,
    });

    return null;
  }

  console.log(`[HOME DATA] ${key} raw response:`, result.value?.data);

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
    console.log(`[HOME DATA] mentalHealthScore: no data for ${date}`);

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

  console.log(
    `[HOME DATA] trackedMetrics.${id}: backend did not return metric`,
  );

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
    chart: normalizeChartByDate(metric?.chart, dates, `trackedMetrics.${id}`),
    dates,
  };

  if (id === "activity") {
    normalizedMetric.value = formatSteps(rawValue);
  }

  const today = getTodayKey();
  const todayIndex = dates.indexOf(today);

  if (todayIndex !== -1) {
    console.log(`[HOME DATA] Today value for trackedMetrics.${id}:`, {
      date: today,
      valueFromCard: normalizedMetric.value,
      valueFromChart: normalizedMetric.chart[todayIndex],
    });
  } else {
    console.log(
      `[HOME DATA] Today (${today}) is not included in trackedMetrics.${id} dates`,
      dates,
    );
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

  console.log(
    `[HOME DATA] calculatedScores.${id}: backend did not return calculated score`,
  );

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

  const normalizedScore: HomeDashboardData["calculatedScores"][number] = {
    ...config,
    ...score,
    value: normalizeDisplayValue(score?.value),
    level: typeof score?.level === "string" ? score.level : "No data",
    status: normalizeScoreStatus(score?.status),
    chart: normalizeChartByDate(score?.chart, dates, `calculatedScores.${id}`),
    dates,
  };

  return normalizedScore;
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

  console.log(`[HOME DATA] trends.${id}: backend did not return trend`);

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

  const normalizedTrend: HomeDashboardData["trends"][number] = {
    ...config,
    ...trend,
    data: normalizeChartByDate(trend?.data, dates, `trends.${id}`),
    dates,
  };

  return normalizedTrend;
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

    achievements: [],

    articles: [],
  };
}

function logNormalizedHomeData(data: HomeDashboardData) {
  console.groupCollapsed("[HOME DATA] Normalized frontend data");

  console.log("mentalHealthScore:", data.mentalHealthScore);

  console.table(
    data.trackedMetrics.map((metric) => ({
      id: metric.id,
      value: metric.value,
      dates: metric.dates?.join(", "),
      chart: metric.chart.join(", "),
    })),
  );

  console.table(
    data.calculatedScores.map((score) => ({
      id: score.id,
      value: score.value,
      level: score.level,
      status: score.status,
      dates: score.dates?.join(", "),
      chart: score.chart.join(", "),
    })),
  );

  console.table(
    data.trends.map((trend) => ({
      id: trend.id,
      label: trend.label,
      dates: trend.dates?.join(", "),
      data: trend.data.join(", "),
    })),
  );

  console.groupEnd();
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

    const mentalHealthData = getResponseData<any>(
      mentalHealthResult,
      "mentalHealthScore",
    );

    const trackedMetricsData = getResponseData<any>(
      trackedMetricsResult,
      "trackedMetrics",
    );

    const calculatedScoresData = getResponseData<any>(
      calculatedScoresResult,
      "calculatedScores",
    );

    const trendsData = getResponseData<any>(trendsResult, "trends");

    const dates = normalizeDates(
      trackedMetricsData?.dates ??
        trendsData?.dates ??
        calculatedScoresData?.dates ??
        mentalHealthData?.dates ??
        defaultDates,
    );

    console.log("[HOME DATA] Final dates used on frontend:", dates);

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

    const homeData: HomeDashboardData = {
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

      achievements: [],
      articles: [],
    };

    logNormalizedHomeData(homeData);

    return homeData;
  } catch (error) {
    console.log("[HOME DATA] Home data fetch crashed completely:", {
      message: (error as any)?.message,
      status: (error as any)?.response?.status,
      data: (error as any)?.response?.data,
    });

    const emptyData = createEmptyHomeDashboardData(defaultDates);

    logNormalizedHomeData(emptyData);

    return emptyData;
  }
}
