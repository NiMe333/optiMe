import { useEffect, useState } from "react";
import { ScrollView, View, Text, useWindowDimensions } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, styles } from "@/styles/home.styles";

import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import WebSidebar from "@/components/navigation/WebSidebar";
import { useAuth } from "@/context/AuthContext";
import { getHomeDashboardData } from "@/services/homeService";
import type { HomeDashboardData } from "@/types/home";

import MentalHealthScoreCard from "@/components/home/MentalHealthScoreCard";
import TrackedMetricCard from "@/components/home/TrackedMetricCard";
import CalculatedScoresSection from "@/components/home/CalculatedScoresSection";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const [homeData, setHomeData] = useState<HomeDashboardData | null>(null);
  const [todayKey, setTodayKey] = useState(getLocalDateKey());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTodayKey(getLocalDateKey());
    }, getMsUntilNextLocalMidnight());

    return () => clearTimeout(timeout);
  }, [todayKey]);

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
  }, [todayKey]);

  function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getMsUntilNextLocalMidnight() {
    const now = new Date();
    const nextMidnight = new Date(now);

    nextMidnight.setHours(24, 0, 1, 0);

    return nextMidnight.getTime() - now.getTime();
  }

  const isWebLayout = width >= 1000;
  const todayLabel = getTodayLabel();

  const mobileTrackedCardWidth = Math.min(width - 66, 330);

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
          <DashboardHeader username={username} todayLabel={todayLabel} />

          <View style={styles.webTopRow}>
            <MentalHealthScoreCard score={homeData.mentalHealthScore} />

            <View style={styles.metricsPanel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Text style={styles.panelTitle}>Tracked Metrics</Text>
                </View>

                <View style={styles.legendRow}>
                  <LegendDot color={colors.blue} label="Measured (Auto)" />
                  <LegendDot color={colors.green} label="Entered (Manual)" />
                  <LegendDot color={colors.purple} label="Calculated (Auto)" />
                </View>
              </View>

              <View style={styles.metricsGrid}>
                {homeData.trackedMetrics.map((metric) => (
                  <TrackedMetricCard key={metric.id} metric={metric} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.webMiddleRow}>
            <CalculatedScoresSection scores={homeData.calculatedScores} />

            <AchievementsPanel achievements={homeData.achievements} />
          </View>

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
        <DashboardHeader username={username} todayLabel={todayLabel} mobile />

        <MentalHealthScoreCard score={homeData.mentalHealthScore} mobile />

        <View style={styles.mobileSectionHeader}>
          <Text style={styles.panelTitle}>Tracked Metrics</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={mobileTrackedCardWidth + 14}
          snapToAlignment="start"
          contentContainerStyle={styles.mobileMetricScrollContent}
        >
          {homeData.trackedMetrics.map((metric) => (
            <View
              key={metric.id}
              style={{
                width: mobileTrackedCardWidth,
              }}
            >
              <TrackedMetricCard metric={metric} mobile />
            </View>
          ))}
        </ScrollView>

        <CalculatedScoresSection scores={homeData.calculatedScores} mobile />

        <AchievementsPanel achievements={homeData.achievements} mobile />

        <ArticlesSection articles={homeData.articles} mobile />
      </ScrollView>

      <MobileBottomNav />
    </SafeAreaView>
  );
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function DashboardHeader({
  username,
  todayLabel,
  mobile = false,
}: {
  username: string;
  todayLabel: string;
  mobile?: boolean;
}) {
  return (
    <View style={mobile ? styles.mobileHeader : styles.webHeader}>
      <View>
        <Text style={mobile ? styles.mobileGreeting : styles.webGreeting}>
          Hi, {username}!
        </Text>

        <Text style={styles.headerSubtitle}>Your mind deserves care too.</Text>

        <Text style={styles.headerDate}>{todayLabel}</Text>
      </View>
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
          <View style={styles.achievementBullet}>
            <Text style={styles.achievementBulletText}>
              {achievement.completed ? "✓" : "•"}
            </Text>
          </View>

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
        <View style={styles.articleImagePattern} />
      </View>

      <View style={styles.articleBody}>
        <Text style={styles.articleCategory}>{article.category}</Text>
        <Text style={styles.articleTitle}>{article.title}</Text>

        <View style={styles.articleBottom}>
          <Text style={styles.articleReadTime}>{article.readTime}</Text>
          <Text style={styles.bookmark}>Save</Text>
        </View>
      </View>
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
