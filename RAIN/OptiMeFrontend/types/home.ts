export type HomeTrendDirection = "up" | "down" | "same";

export type HomeMetricSource = "measured" | "entered" | "calculated";

export type HomeScoreStatus = "healthy" | "okay" | "warning" | "critical";

export type HomeDashboardData = {
  user: {
    username: string;
    gender?: string;
    dateOfBirth?: string;
    education?: string;
    employment?: string;
  };

  mentalHealthScore: {
    value: number;
    label: string;
    status: HomeScoreStatus;
    changeFromLastWeek: number;
  };

  trackedMetrics: HomeTrackedMetric[];

  calculatedScores: HomeCalculatedScore[];

  trends: HomeTrendSeries[];

  achievements: HomeAchievement[];

  articles: HomeArticle[];
};

export type HomeTrackedMetricVariant = "average" | "double" | "score";

export type HomeTrackedMetric = {
  id: string;
  title: string;

  variant: HomeTrackedMetricVariant;

  source: HomeMetricSource;

  valueLabel?: string;
  value: string | number;

  secondValue?: string | number;
  secondLabel?: string;

  suffix?: string;
  maxValue?: number;

  subtitle: string;

  trend: {
    direction: HomeTrendDirection;
    value: number;
    isGood: boolean;
  };

  chart: number[];
  color: string;
};

export type HomeCalculatedScore = {
  id: string;
  title: string;
  value: string | number;
  suffix?: string;

  level?: string;
  status?: HomeScoreStatus;

  subtitle: string;
  chart: number[];
  color: string;
};

export type HomeTrendSeries = {
  id: string;
  label: string;
  color: string;
  data: number[];
};

export type HomeAchievement = {
  id: string;
  title: string;
  streak: string;
  completed: boolean;
};

export type HomeArticle = {
  id: string;
  category: string;
  title: string;
  readTime: string;
  color: string;
};
