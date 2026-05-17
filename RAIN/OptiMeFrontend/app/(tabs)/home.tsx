import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, styles } from "@/styles/home.styles";

import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import WebSidebar from "@/components/navigation/WebSidebar";
import { useAuth } from "@/context/AuthContext";
import { getHomeDashboardData } from "@/services/homeService";
import type { HomeDashboardData } from "@/types/home";

import MentalHealthScoreCard from "@/components/home/MentalHealthScoreCard";
import TrackedMetricCard from "@/components/home/TrackedMetricCard";

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
            <MentalHealthScoreCard score={homeData.mentalHealthScore} />

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

        <MentalHealthScoreCard score={homeData.mentalHealthScore} mobile />

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
          Hi, {username}!
        </Text>
        <Text style={styles.headerSubtitle}>Your mind deserves care too.</Text>
      </View>

      {!mobile && (
        <View style={styles.headerActions}>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>♟</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      )}
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
