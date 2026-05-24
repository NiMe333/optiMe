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

function normalizeChart(chart?: number[]) {
  if (!Array.isArray(chart)) {
    return [];
  }

  return [...chart].reverse();
}

function formatSteps(value: unknown) {
  if (typeof value !== "number") {
    return value;
  }

  return value.toLocaleString("en-US");
}

function normalizeTrackedMetric(metric: any) {
  const config = trackedMetricUiConfig[metric.id] ?? {};

  const normalizedMetric = {
    ...metric,
    ...config,
    chart: normalizeChart(metric.chart),
  };

  if (metric.id === "activity") {
    normalizedMetric.value = formatSteps(metric.value);
  }

  return normalizedMetric;
}

function normalizeCalculatedScore(score: any) {
  const config = calculatedScoreUiConfig[score.id] ?? {};

  return {
    ...score,
    ...config,
    chart: normalizeChart(score.chart),
  };
}

function normalizeTrend(trend: any) {
  const config = trendUiConfig[trend.id] ?? {};

  return {
    ...trend,
    ...config,
    data: normalizeChart(trend.data),
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

    const mentalHealthScore =
      mentalHealthResponse.data?.mentalHealthScore ??
      mockHomeData.mentalHealthScore;

    const trackedMetrics = Array.isArray(
      trackedMetricsResponse.data?.trackedMetrics,
    )
      ? trackedMetricsResponse.data.trackedMetrics.map(normalizeTrackedMetric)
      : mockHomeData.trackedMetrics;

    const calculatedScores = Array.isArray(
      calculatedScoresResponse.data?.calculatedScores,
    )
      ? calculatedScoresResponse.data.calculatedScores.map(
          normalizeCalculatedScore,
        )
      : mockHomeData.calculatedScores;

    const trends = Array.isArray(trendsResponse.data?.trends)
      ? trendsResponse.data.trends.map(normalizeTrend)
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
    console.log("Home data fetch failed, using mock data:", error);

    return mockHomeData;
  }
}
