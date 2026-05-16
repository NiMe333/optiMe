import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import WebSidebar from "@/components/navigation/WebSidebar";
import { useAuth } from "@/context/AuthContext";
import { getHomeDashboardData } from "@/services/homeService";
import type { HomeDashboardData } from "@/types/home";

const colors = {
  background: "#F4F8FC",
  white: "#FFFFFF",
  navy: "#183F68",
  navyDark: "#06345E",
  navySoft: "#355C86",
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
  red: "#F35B65",
  redSoft: "#FFECEF",
  text: "#233548",
  textSoft: "#6E8092",
  border: "rgba(24,63,104,0.08)",
  shadow: "#B7D5E5",
};

const softShadow =
  Platform.OS === "web"
    ? ({
        boxShadow: "0px 16px 38px rgba(24, 63, 104, 0.10)",
      } as any)
    : {
        shadowColor: colors.shadow,
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      };

const strongShadow =
  Platform.OS === "web"
    ? ({
        boxShadow: "0px 22px 50px rgba(24, 63, 104, 0.16)",
      } as any)
    : {
        shadowColor: colors.shadow,
        shadowOpacity: 0.24,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      };

const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const [homeData, setHomeData] = useState<HomeDashboardData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      const data = await getHomeDashboardData();

      if (mounted) {
        setHomeData(data);
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const isWebLayout = width >= 1000;

  if (!homeData) {
    return (
      <View style={styles.loadingRoot}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const username = (user as any)?.username || homeData.user.username || "Nik";

  if (isWebLayout) {
    return (
      <View style={styles.webRoot}>
        <View style={styles.webSidebarShell}>
          <WebSidebar />
        </View>

        <ScrollView
          style={styles.webContent}
          contentContainerStyle={styles.webContentInner}
          showsVerticalScrollIndicator={false}
        >
          <DashboardHeader username={username} />

          <View style={styles.webTopRow}>
            <MentalScoreCard score={homeData.mentalHealthScore} />

            <View style={styles.metricsPanel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Text style={styles.panelTitle}>Tracked Metrics</Text>
                  <Text style={styles.infoIcon}>ⓘ</Text>
                </View>

                <View style={styles.legendRow}>
                  <LegendDot color={colors.blue} label="Measured (Auto)" />
                  <LegendDot color={colors.green} label="Entered (Manual)" />
                  <LegendDot color={colors.purple} label="Calculated (Auto)" />
                </View>

                <Pressable>
                  <Text style={styles.editMetrics}>Edit Metrics ✎</Text>
                </Pressable>
              </View>

              <View style={styles.metricsGrid}>
                {homeData.trackedMetrics.map((metric) => (
                  <TrackedMetricCard key={metric.id} metric={metric} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.webMiddleRow}>
            <View style={styles.calculatedPanel}>
              <View style={styles.panelTitleRow}>
                <Text style={styles.panelTitle}>Calculated Scores</Text>
                <Text style={styles.infoIcon}>ⓘ</Text>
              </View>

              <View style={styles.calculatedGrid}>
                {homeData.calculatedScores.map((score) => (
                  <CalculatedScoreCard key={score.id} score={score} />
                ))}
              </View>
            </View>

            <AchievementsPanel achievements={homeData.achievements} />
          </View>

          <TrendOverview trends={homeData.trends} />

          <ArticlesSection articles={homeData.articles} />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mobileRoot} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContent}
      >
        <DashboardHeader username={username} mobile />

        <MentalScoreCard score={homeData.mentalHealthScore} mobile />

        <View style={styles.mobileSectionHeader}>
          <Text style={styles.panelTitle}>Tracked Metrics</Text>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </View>

        <View style={styles.mobileMetricGrid}>
          {homeData.trackedMetrics.map((metric) => (
            <TrackedMetricCard key={metric.id} metric={metric} mobile />
          ))}
        </View>

        <View style={styles.mobileSectionHeader}>
          <Text style={styles.panelTitle}>Calculated Scores</Text>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </View>

        <View style={styles.mobileCalculatedGrid}>
          {homeData.calculatedScores.map((score) => (
            <CalculatedScoreCard key={score.id} score={score} mobile />
          ))}
        </View>

        <AchievementsPanel achievements={homeData.achievements} mobile />

        <TrendOverview trends={homeData.trends} mobile />

        <ArticlesSection articles={homeData.articles} mobile />
      </ScrollView>

      <MobileBottomNav />
    </SafeAreaView>
  );
}

function DashboardHeader({
  username,
  mobile = false,
}: {
  username: string;
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileHeader : styles.webHeader}>
      <View>
        <Text style={mobile ? styles.mobileGreeting : styles.webGreeting}>
          Hi, {username}! 👋
        </Text>
        <Text style={styles.headerSubtitle}>Your mind deserves care too.</Text>
      </View>

      {!mobile && (
        <View style={styles.headerActions}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <Text style={styles.searchPlaceholder}>
              Search articles, metrics, or tools...
            </Text>
            <View style={styles.shortcutBox}>
              <Text style={styles.shortcutText}>⌘ K</Text>
            </View>
          </View>

          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>♟</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function MentalScoreCard({
  score,
  mobile = false,
}: {
  score: HomeDashboardData["mentalHealthScore"];
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileScoreCard : styles.scoreCard}>
      <View style={styles.scoreCardHeader}>
        <Text style={styles.scoreCardTitle}>Mental Health Score</Text>
        <Text style={styles.moreDots}>•••</Text>
      </View>

      <View style={mobile ? styles.mobileRing : styles.scoreRing}>
        <View style={mobile ? styles.mobileRingInner : styles.scoreRingInner}>
          <Text style={mobile ? styles.mobileScoreValue : styles.scoreValue}>
            {score.value}
          </Text>
          <Text style={styles.scoreState}>{score.label}</Text>
        </View>
      </View>

      <Text style={styles.scoreDescription}>
        Composite score from{"\n"}all tracked metrics
      </Text>

      <View style={styles.scoreChangePill}>
        <Text style={styles.scoreChangeText}>
          ↑ {score.changeFromLastWeek} pts
        </Text>
        <Text style={styles.scoreChangeMuted}> vs last week</Text>
      </View>
    </View>
  );
}

function TrackedMetricCard({
  metric,
  mobile = false,
}: {
  metric: HomeDashboardData["trackedMetrics"][number];
  mobile?: boolean;
}) {
  const dotColor =
    metric.source === "measured"
      ? colors.blue
      : metric.source === "entered"
        ? colors.green
        : colors.purple;

  const trendSymbol =
    metric.trend.direction === "up"
      ? "↑"
      : metric.trend.direction === "down"
        ? "↓"
        : "→";

  return (
    <View style={mobile ? styles.mobileMetricCard : styles.metricCard}>
      <View style={styles.metricTopRow}>
        <View style={styles.metricTitleBlock}>
          <Text style={[styles.metricIcon, { color: metric.color }]}>
            {metric.icon}
          </Text>

          <View style={styles.metricTextBlock}>
            <View style={styles.metricTitleRow}>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <View style={[styles.metricDot, { backgroundColor: dotColor }]} />
            </View>

            {!!metric.valueLabel && (
              <Text style={styles.metricValueLabel}>{metric.valueLabel}</Text>
            )}

            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>{metric.value}</Text>

              {!!metric.secondValue && (
                <>
                  <Text style={styles.metricSecondLabel}>
                    {metric.secondLabel || "Second"}
                  </Text>
                  <Text style={styles.metricValue}>{metric.secondValue}</Text>
                </>
              )}

              {!!metric.suffix && (
                <Text style={styles.metricSuffix}>{metric.suffix}</Text>
              )}
            </View>

            <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
          </View>
        </View>

        <View
          style={[
            styles.trendPill,
            metric.trend.isGood ? styles.trendGood : styles.trendBad,
          ]}
        >
          <Text
            style={[
              styles.trendText,
              metric.trend.isGood ? styles.trendTextGood : styles.trendTextBad,
            ]}
          >
            {trendSymbol} {metric.trend.value}%
          </Text>
        </View>
      </View>

      <MiniSparkline data={metric.chart} color={metric.color} />
    </View>
  );
}

function CalculatedScoreCard({
  score,
  mobile = false,
}: {
  score: HomeDashboardData["calculatedScores"][number];
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileCalculatedCard : styles.calculatedCard}>
      <View style={styles.calculatedTop}>
        <Text style={[styles.calculatedIcon, { color: score.color }]}>
          {score.icon}
        </Text>
        <Text style={styles.calculatedTitle}>{score.title}</Text>
      </View>

      <View style={styles.calculatedValueRow}>
        <Text
          style={[
            styles.calculatedValue,
            score.value === "Moderate" && styles.calculatedTextValue,
          ]}
        >
          {score.value}
        </Text>

        {!!score.suffix && (
          <Text style={styles.calculatedSuffix}>{score.suffix}</Text>
        )}
      </View>

      <MiniSparkline data={score.chart} color={score.color} small />

      <Text style={styles.autoCalculated}>{score.subtitle}</Text>
    </View>
  );
}

function AchievementsPanel({
  achievements,
  mobile = false,
}: {
  achievements: HomeDashboardData["achievements"];
  mobile?: boolean;
}) {
  return (
    <View
      style={mobile ? styles.mobileAchievementsPanel : styles.achievementsPanel}
    >
      <View style={styles.achievementsHeader}>
        <Text style={styles.panelTitle}>Achievements</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementRow}>
          <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>

          <Text style={styles.achievementTitle}>{achievement.title}</Text>

          <Text style={styles.achievementStreak}>{achievement.streak}</Text>

          <Text style={styles.achievementCheck}>
            {achievement.completed ? "✓" : "○"}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TrendOverview({
  trends,
  mobile = false,
}: {
  trends: HomeDashboardData["trends"];
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileTrendPanel : styles.trendPanel}>
      <View style={styles.trendHeader}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>Trends Overview</Text>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </View>

        {!mobile && (
          <View style={styles.trendLegend}>
            {trends.map((item) => (
              <LegendDot key={item.id} color={item.color} label={item.label} />
            ))}
          </View>
        )}

        <View style={styles.daysPill}>
          <Text style={styles.daysPillText}>7 Days⌄</Text>
        </View>
      </View>

      <View style={styles.fakeChart}>
        <View style={styles.chartScaleLeft}>
          <Text style={styles.chartScaleText}>100</Text>
          <Text style={styles.chartScaleText}>75</Text>
          <Text style={styles.chartScaleText}>50</Text>
          <Text style={styles.chartScaleText}>25</Text>
          <Text style={styles.chartScaleText}>0</Text>
        </View>

        <View style={styles.chartArea}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />

          <View style={styles.chartBars}>
            {days.map((day, index) => (
              <View key={`${day}-${index}`} style={styles.chartDayColumn}>
                {trends.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.chartPoint,
                      {
                        backgroundColor: item.color,
                        bottom: `${item.data[index] ?? 0}%`,
                      } as any,
                    ]}
                  />
                ))}

                <Text style={styles.chartDay}>
                  {index === 0 ? "May 8" : day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {!mobile && (
          <View style={styles.chartScaleRight}>
            <Text style={styles.chartScaleText}>100</Text>
            <Text style={styles.chartScaleText}>75</Text>
            <Text style={styles.chartScaleText}>50</Text>
            <Text style={styles.chartScaleText}>25</Text>
            <Text style={styles.chartScaleText}>0</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ArticlesSection({
  articles,
  mobile = false,
}: {
  articles: HomeDashboardData["articles"];
  mobile?: boolean;
}) {
  return (
    <View style={styles.articlesSection}>
      <View style={styles.articlesHeader}>
        <Text style={styles.panelTitle}>Mindful Articles</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.articlesRow}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} mobile={mobile} />
        ))}
      </ScrollView>
    </View>
  );
}

function ArticleCard({
  article,
  mobile = false,
}: {
  article: HomeDashboardData["articles"][number];
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileArticleCard : styles.articleCard}>
      <View style={[styles.articleImage, { backgroundColor: article.color }]}>
        <Text style={styles.articleEmoji}>{article.emoji}</Text>
      </View>

      <View style={styles.articleBody}>
        <Text style={styles.articleCategory}>{article.category}</Text>
        <Text style={styles.articleTitle}>{article.title}</Text>

        <View style={styles.articleBottom}>
          <Text style={styles.articleReadTime}>◷ {article.readTime}</Text>
          <Text style={styles.bookmark}>♧</Text>
        </View>
      </View>
    </View>
  );
}

function MiniSparkline({
  data,
  color,
  small = false,
}: {
  data: number[];
  color: string;
  small?: boolean;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  return (
    <View style={small ? styles.sparklineSmall : styles.sparkline}>
      {data.map((value, index) => {
        const normalized =
          max === min ? 40 : ((value - min) / (max - min)) * 42 + 8;

        return (
          <View key={index} style={styles.sparkColumn}>
            <View
              style={[
                styles.sparkBar,
                {
                  height: normalized,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        );
      })}

      {!small && (
        <View style={styles.sparkDays}>
          {days.map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.sparkDay}>
              {day}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "800",
  },

  webRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },

  webSidebarShell: {
    width: 112,
    padding: 12,
  },

  webContent: {
    flex: 1,
  },

  webContentInner: {
    paddingTop: 22,
    paddingRight: 28,
    paddingBottom: 28,
    gap: 18,
  },

  webHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  webGreeting: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.navy,
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textSoft,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  searchBox: {
    width: 530,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.72)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 12,
    ...softShadow,
  },

  searchIcon: {
    fontSize: 28,
    color: colors.textSoft,
  },

  searchPlaceholder: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 15,
    fontWeight: "600",
  },

  shortcutBox: {
    backgroundColor: "rgba(24,63,104,0.08)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  shortcutText: {
    color: colors.navySoft,
    fontWeight: "800",
  },

  notificationButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    ...softShadow,
  },

  notificationIcon: {
    fontSize: 22,
    color: colors.navy,
  },

  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    position: "absolute",
    right: 14,
    top: 13,
  },

  webTopRow: {
    flexDirection: "row",
    gap: 28,
    alignItems: "stretch",
  },

  scoreCard: {
    width: 375,
    minHeight: 370,
    borderRadius: 18,
    backgroundColor: colors.navyDark,
    padding: 24,
    ...strongShadow,
  },

  mobileScoreCard: {
    borderRadius: 22,
    backgroundColor: colors.navyDark,
    padding: 22,
    marginBottom: 18,
    ...strongShadow,
  },

  scoreCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreCardTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },

  moreDots: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  scoreRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 18,
    borderColor: colors.green,
    borderLeftColor: "rgba(255,255,255,0.94)",
    borderBottomColor: "rgba(255,255,255,0.94)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    transform: [{ rotate: "35deg" }],
  },

  mobileRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 16,
    borderColor: colors.green,
    borderLeftColor: "rgba(255,255,255,0.94)",
    borderBottomColor: "rgba(255,255,255,0.94)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    transform: [{ rotate: "35deg" }],
  },

  scoreRingInner: {
    transform: [{ rotate: "-35deg" }],
    alignItems: "center",
  },

  mobileRingInner: {
    transform: [{ rotate: "-35deg" }],
    alignItems: "center",
  },

  scoreValue: {
    color: colors.white,
    fontSize: 56,
    fontWeight: "900",
  },

  mobileScoreValue: {
    color: colors.white,
    fontSize: 46,
    fontWeight: "900",
  },

  scoreState: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  scoreDescription: {
    textAlign: "center",
    color: colors.white,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 22,
  },

  scoreChangePill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  scoreChangeText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "900",
  },

  scoreChangeMuted: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  metricsPanel: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.36)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  panelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  panelTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "900",
  },

  infoIcon: {
    color: colors.textSoft,
    fontSize: 13,
  },

  legendRow: {
    flexDirection: "row",
    gap: 26,
    flexWrap: "wrap",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendText: {
    color: colors.navySoft,
    fontWeight: "700",
    fontSize: 12,
  },

  editMetrics: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "900",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  metricCard: {
    width: "24%",
    minWidth: 240,
    flexGrow: 1,
    height: 132,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...softShadow,
  },

  mobileMetricGrid: {
    gap: 12,
  },

  mobileMetricCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    ...softShadow,
  },

  metricTopRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  metricTitleBlock: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },

  metricIcon: {
    width: 28,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  metricTextBlock: {
    flex: 1,
  },

  metricTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metricTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
  },

  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  metricValueLabel: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },

  metricValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 1,
  },

  metricValue: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: "900",
  },

  metricSecondLabel: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 14,
    marginBottom: 5,
  },

  metricSuffix: {
    color: colors.navySoft,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  metricSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  trendPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },

  trendGood: {
    backgroundColor: colors.greenSoft,
  },

  trendBad: {
    backgroundColor: colors.redSoft,
  },

  trendText: {
    fontSize: 11,
    fontWeight: "900",
  },

  trendTextGood: {
    color: colors.green,
  },

  trendTextBad: {
    color: colors.red,
  },

  sparkline: {
    height: 44,
    marginTop: 6,
  },

  sparklineSmall: {
    height: 30,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },

  sparkColumn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  sparkBar: {
    width: 4,
    borderRadius: 4,
    opacity: 0.9,
  },

  sparkDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },

  sparkDay: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: "700",
  },

  webMiddleRow: {
    flexDirection: "row",
    gap: 18,
    alignItems: "stretch",
  },

  calculatedPanel: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  calculatedGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  mobileCalculatedGrid: {
    gap: 12,
  },

  calculatedCard: {
    flex: 1,
    minHeight: 135,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    ...softShadow,
  },

  mobileCalculatedCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    ...softShadow,
  },

  calculatedTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  calculatedIcon: {
    fontSize: 26,
    fontWeight: "900",
  },

  calculatedTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
  },

  calculatedValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    gap: 4,
  },

  calculatedValue: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: "900",
  },

  calculatedTextValue: {
    color: colors.purple,
    fontSize: 23,
  },

  calculatedSuffix: {
    color: colors.navySoft,
    fontWeight: "800",
    marginBottom: 5,
  },

  autoCalculated: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },

  achievementsPanel: {
    width: 470,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    ...softShadow,
  },

  mobileAchievementsPanel: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 18,
    ...softShadow,
  },

  achievementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 13,
  },

  achievementEmoji: {
    width: 34,
    fontSize: 28,
    textAlign: "center",
  },

  achievementTitle: {
    flex: 1,
    color: colors.navy,
    fontWeight: "900",
    fontSize: 13,
  },

  achievementStreak: {
    color: colors.navySoft,
    fontWeight: "700",
    fontSize: 13,
  },

  achievementCheck: {
    color: colors.green,
    fontSize: 22,
    fontWeight: "900",
  },

  trendPanel: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...softShadow,
  },

  mobileTrendPanel: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 18,
    ...softShadow,
  },

  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  trendLegend: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
  },

  daysPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "rgba(244,248,252,0.7)",
  },

  daysPillText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "900",
  },

  fakeChart: {
    height: 112,
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },

  chartScaleLeft: {
    width: 32,
    justifyContent: "space-between",
  },

  chartScaleRight: {
    width: 32,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  chartScaleText: {
    color: colors.navySoft,
    fontSize: 11,
    fontWeight: "700",
  },

  chartArea: {
    flex: 1,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  gridLine: {
    position: "relative",
    height: 1,
    backgroundColor: "rgba(24,63,104,0.08)",
    marginBottom: 20,
  },

  chartBars: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: -18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  chartDayColumn: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },

  chartPoint: {
    width: 7,
    height: 7,
    borderRadius: 4,
    position: "absolute",
  },

  chartDay: {
    position: "absolute",
    bottom: -18,
    color: colors.navySoft,
    fontSize: 11,
    fontWeight: "700",
  },

  articlesSection: {
    marginTop: 4,
  },

  articlesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  seeAll: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: "900",
  },

  articlesRow: {
    gap: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },

  articleCard: {
    width: 265,
    height: 168,
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },

  mobileArticleCard: {
    width: 240,
    height: 170,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },

  articleImage: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  articleEmoji: {
    fontSize: 34,
  },

  articleBody: {
    padding: 12,
    flex: 1,
  },

  articleCategory: {
    color: colors.blue,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  articleTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: 4,
  },

  articleBottom: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  articleReadTime: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
  },

  bookmark: {
    color: colors.navySoft,
    fontSize: 18,
  },

  mobileRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },

  mobileContent: {
    padding: 18,
    paddingBottom: 105,
  },

  mobileHeader: {
    marginBottom: 18,
  },

  mobileGreeting: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.navy,
  },

  mobileSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    marginBottom: 12,
  },
});
