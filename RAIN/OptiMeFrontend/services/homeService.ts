import { homeColors, mockHomeData } from "@/data/mockHomeData";
import type { HomeDashboardData } from "@/types/home";

const USE_MOCK_HOME_DATA = false;

const trackedMetricUiConfig: Record<string, any> = {
  sleep: {
    variant: "average",
    source: "measured",
    valueLabel: "Last night",
    color: homeColors.purple,
  },

  activity: {
    variant: "double",
    source: "measured",
    valueLabel: "Today",
    maxValue: 8000,
    color: homeColors.green,
  },

  "screen-time": {
    variant: "average",
    source: "measured",
    valueLabel: "Today",
    color: homeColors.orange,
  },

  socialization: {
    variant: "score",
    source: "entered",
    valueLabel: "Social score",
    maxValue: 5,
    color: homeColors.purple,
  },

  mood: {
    variant: "score",
    source: "entered",
    valueLabel: "Today",
    maxValue: 5,
    color: homeColors.yellow,
  },

  stress: {
    variant: "score",
    source: "entered",
    valueLabel: "Financial / Work / School",
    maxValue: 5,
    color: homeColors.pink,
  },

  "financial-work-school-stress": {
    variant: "score",
    source: "entered",
    valueLabel: "Financial / Work / School",
    maxValue: 5,
    color: homeColors.pink,
  },
};

const calculatedScoreUiConfig: Record<string, any> = {
  "anxiety-signals": {
    color: homeColors.purple,
  },

  "stress-level": {
    color: homeColors.orange,
  },

  "mood-balance": {
    color: homeColors.green,
  },
};

const trendUiConfig: Record<string, any> = {
  sleep: {
    color: homeColors.purple,
  },

  movement: {
    color: homeColors.green,
  },

  "social-score": {
    color: homeColors.blue,
  },

  "stress-level": {
    color: homeColors.pink,
  },

  "screen-time": {
    color: homeColors.orange,
  },
};

const emptyTrend = {
  direction: "same",
  value: 0,
  isGood: true,
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getDateKey(new Date());
}

function parseDateKey(value: unknown) {
  if (!value) {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return getDateKey(value);
  }

  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return getDateKey(date);
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "$date" in value &&
    typeof (value as any).$date === "string"
  ) {
    const date = new Date((value as any).$date);

    if (!Number.isNaN(date.getTime())) {
      return getDateKey(date);
    }
  }

  return "";
}

function hasTodaySnapshot(latestDate: unknown) {
  const latestDateKey = parseDateKey(latestDate);

  if (!latestDateKey) {
    // Če backend še ne pošilja datuma, ne moremo vedeti.
    // Zato ne nastavimo na 0 kar na slepo.
    return true;
  }

  return latestDateKey === getTodayKey();
}

function getMissingDaysFromToday(latestDate: unknown) {
  const latestDateKey = parseDateKey(latestDate);

  if (!latestDateKey) {
    return 0;
  }

  const today = new Date(`${getTodayKey()}T00:00:00`);
  const latest = new Date(`${latestDateKey}T00:00:00`);

  if (Number.isNaN(today.getTime()) || Number.isNaN(latest.getTime())) {
    return 0;
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((today.getTime() - latest.getTime()) / oneDay);

  return Math.max(0, diff);
}

function normalizeChart(chart?: number[], latestDate?: unknown) {
  if (!Array.isArray(chart)) {
    return [];
  }

  // Backend vrača [najnovejši, starejši, ...],
  // frontend graf pa naj riše [starejši, ..., najnovejši].
  const reversedChart = [...chart].reverse();

  const chartWithSevenValues =
    reversedChart.length >= 7
      ? reversedChart.slice(-7)
      : [...Array(7 - reversedChart.length).fill(0), ...reversedChart];

  const missingDays = getMissingDaysFromToday(latestDate);

  if (missingDays <= 0) {
    return chartWithSevenValues;
  }

  if (missingDays >= 7) {
    return Array(7).fill(0);
  }

  // Če zadnji zapis ni današnji, npr. manjka 1 dan:
  // [18,19,20,21,22,23] -> [18,19,20,21,22,23,0]
  return [
    ...chartWithSevenValues.slice(missingDays),
    ...Array(missingDays).fill(0),
  ];
}

function formatSteps(value: unknown) {
  if (typeof value !== "number") {
    return value;
  }

  return value.toLocaleString("en-US");
}

function normalizeMentalHealthScore(score: any, latestDate?: unknown) {
  const hasTodayData = hasTodaySnapshot(latestDate);

  if (!score) {
    return mockHomeData.mentalHealthScore;
  }

  if (!hasTodayData) {
    return {
      ...score,
      value: 0,
      label: "No data",
      status: "warning",
      changeFromLastWeek: 0,
    };
  }

  return score;
}

function normalizeTrackedMetric(metric: any, latestDate?: unknown) {
  const config = trackedMetricUiConfig[metric.id] ?? {};
  const hasTodayData = hasTodaySnapshot(latestDate);

  const rawValue = hasTodayData ? metric.value : 0;

  const normalizedMetric = {
    ...metric,
    ...config,
    value: rawValue,
    trend: hasTodayData ? metric.trend : emptyTrend,
    chart: normalizeChart(metric.chart, latestDate),
  };

  if (metric.id === "activity") {
    normalizedMetric.value = formatSteps(rawValue);
  }

  return normalizedMetric;
}

function normalizeCalculatedScore(score: any, latestDate?: unknown) {
  const config = calculatedScoreUiConfig[score.id] ?? {};
  const hasTodayData = hasTodaySnapshot(latestDate);

  return {
    ...score,
    ...config,
    value: hasTodayData ? score.value : 0,
    level: hasTodayData ? score.level : "No data",
    status: hasTodayData ? score.status : "warning",
    chart: normalizeChart(score.chart, latestDate),
  };
}

function normalizeTrend(trend: any, latestDate?: unknown) {
  const config = trendUiConfig[trend.id] ?? {};

  return {
    ...trend,
    ...config,
    data: normalizeChart(trend.data, latestDate),
  };
}

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  if (USE_MOCK_HOME_DATA) {
    return mockHomeData;
  }

  try {
    const api = await import("@/services/apiI");

    const [
      mentalHealthResponse,
      trackedMetricsResponse,
      calculatedScoresResponse,
      trendsResponse,
    ] = await Promise.all([
      api.default.get("/data/mentalHealthScore"),
      api.default.get("/data/trackedMetrics"),
      api.default.get("/data/calculatedScores"),
      api.default.get("/data/trends"),
    ]);

    const mentalHealthLatestDate =
      mentalHealthResponse.data?.latestDate ?? null;

    const trackedMetricsLatestDate =
      trackedMetricsResponse.data?.latestDate ?? null;

    const calculatedScoresLatestDate =
      calculatedScoresResponse.data?.latestDate ?? null;

    const trendsLatestDate = trendsResponse.data?.latestDate ?? null;

    const mentalHealthScore = normalizeMentalHealthScore(
      mentalHealthResponse.data?.mentalHealthScore ??
        mockHomeData.mentalHealthScore,
      mentalHealthLatestDate,
    );

    const trackedMetrics = Array.isArray(
      trackedMetricsResponse.data?.trackedMetrics,
    )
      ? trackedMetricsResponse.data.trackedMetrics.map((metric: any) =>
          normalizeTrackedMetric(metric, trackedMetricsLatestDate),
        )
      : mockHomeData.trackedMetrics;

    const calculatedScores = Array.isArray(
      calculatedScoresResponse.data?.calculatedScores,
    )
      ? calculatedScoresResponse.data.calculatedScores.map((score: any) =>
          normalizeCalculatedScore(score, calculatedScoresLatestDate),
        )
      : mockHomeData.calculatedScores;

    const trends = Array.isArray(trendsResponse.data?.trends)
      ? trendsResponse.data.trends.map((trend: any) =>
          normalizeTrend(trend, trendsLatestDate),
        )
      : mockHomeData.trends;

    return {
      ...mockHomeData,

      mentalHealthScore,
      trackedMetrics,
      calculatedScores,
      trends,

      // To backend še ne vrača
      achievements: mockHomeData.achievements,
      articles: mockHomeData.articles,
    };
  } catch (error) {
    console.log("Home data fetch failed, using mock data:", {
      message: (error as any)?.message,
      status: (error as any)?.response?.status,
      data: (error as any)?.response?.data,
    });

    return mockHomeData;
  }
}
