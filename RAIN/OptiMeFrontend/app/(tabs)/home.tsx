import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();

  const isWebLayout = width >= 900;

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  if (isWebLayout) {
    return (
      <View style={styles.webRoot}>
        <View style={styles.webSidebar}>
          <Text style={styles.logo}>💙</Text>
          <Text style={styles.webNavActive}>⌂</Text>
          <Text style={styles.webNav}>▥</Text>
          <Text style={styles.webNav}>♡</Text>
          <Text style={styles.webNav}>♙</Text>
        </View>

        <ScrollView
          style={styles.webContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.webTop}>
            <Text style={styles.webPageTitle}>Home</Text>

            <Pressable onPress={handleLogout} style={styles.bellButton}>
              <Text>🔔</Text>
            </Pressable>
          </View>

          <View style={styles.webGrid}>
            <View style={styles.webLeftColumn}>
              <HeroCard />

              <Text style={styles.sectionTitle}>Mental Health Score</Text>

              <View style={styles.webScoreCircle}>
                <Text style={styles.scoreNumber}>80</Text>
                <Text style={styles.scoreLabel}>Healthy</Text>
              </View>
            </View>

            <View style={styles.webRightColumn}>
              <Text style={styles.sectionTitle}>Mental Health Metrics</Text>

              <View style={styles.webMetricsRow}>
                <FreudCard web />
                <MoodCard web />
              </View>

              <Text style={styles.sectionTitle}>Badges</Text>

              <View style={styles.webBadgesBox}>
                <Badge emoji="🌙" title="Sleep Balance" />
                <Badge emoji="📵" title="Digital Detox" />
                <Badge emoji="🧠" title="Active Mind" />
                <Badge emoji="☯️" title="Inner Balance" />
              </View>
            </View>
          </View>

          <View style={styles.webArticlesHeader}>
            <Text style={styles.sectionTitle}>Mindful Articles</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          <View style={styles.webArticlesRow}>
            <Article title="The Hidden Impact of Screen Time on Your Mind" />
            <Article title="Better Sleep, Better Mind: Simple Changes" />
            <Article title="How Breathing Changes Your Mood" />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.mobileRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContent}
      >
        <Text style={styles.mobilePageTitle}>Home</Text>

        <HeroCard />

        <Text style={styles.sectionTitle}>Mental Health Score</Text>

        <View style={styles.mobileScoreCircle}>
          <Text style={styles.scoreNumber}>80</Text>
          <Text style={styles.scoreLabel}>Healthy</Text>
        </View>

        <Text style={styles.sectionTitle}>Mental Health Metrics</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FreudCard />
          <MoodCard />
        </ScrollView>

        <Text style={styles.sectionTitle}>Badges</Text>

        <View style={styles.mobileBadgesBox}>
          <Badge emoji="🌙" title="Sleep Balance" />
          <Badge emoji="📵" title="Digital Detox" />
          <Badge emoji="🧠" title="Active Mind" />
          <Badge emoji="☯️" title="Inner Balance" />
        </View>

        <View style={styles.mobileArticlesHeader}>
          <Text style={styles.sectionTitle}>Mindful Articles</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Article title="The Hidden Impact of Screen Time on Your Mind" />
          <Article title="Better Sleep, Better Mind: Simple Changes" />
        </ScrollView>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function HeroCard() {
  return (
    <View style={styles.heroCard}>
      <View>
        <Text style={styles.heroTitle}>Hi, Nik!</Text>
        <Text style={styles.heroSub}>Your mind deserves care too.</Text>
      </View>

      <View style={styles.bellButton}>
        <Text>🔔</Text>
      </View>
    </View>
  );
}

function FreudCard({ web = false }: { web?: boolean }) {
  return (
    <View style={web ? styles.webMetricCardDark : styles.mobileMetricCardDark}>
      <Text style={styles.metricTitle}>Freud Score</Text>

      <View style={styles.miniCircle}>
        <Text style={styles.metricBig}>80</Text>
        <Text style={styles.metricSmall}>Healthy</Text>
      </View>
    </View>
  );
}

function MoodCard({ web = false }: { web?: boolean }) {
  return (
    <View
      style={web ? styles.webMetricCardLight : styles.mobileMetricCardLight}
    >
      <Text style={styles.metricTitleLight}>☹ Mood</Text>
      <Text style={styles.moodText}>Sad</Text>
      <Text style={styles.chartIcon}>▁▃▅▇▅▃</Text>
    </View>
  );
}

function Badge({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={styles.badgeText}>{title}</Text>
    </View>
  );
}

function Article({ title }: { title: string }) {
  return (
    <View style={styles.articleCard}>
      <Text style={styles.articleImage}>◔</Text>
      <Text style={styles.articleTag}>MENTAL HEALTH</Text>
      <Text style={styles.articleTitle}>{title}</Text>
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Text style={styles.navActiveMobile}>⌂</Text>
      <Text style={styles.navMobile}>▥</Text>
      <Text style={styles.navMobile}>♡</Text>
      <Text style={styles.navMobile}>♙</Text>
    </View>
  );
}

const colors = {
  navy: "#183F68",
  dark: "#453024",
  lightBlue: "#B8D5E9",
  bgDark: "#1F1F1F",
  soft: "#F5EFE9",
};

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.bgDark,
  },
  webSidebar: {
    width: 92,
    backgroundColor: "#fff",
    margin: 18,
    borderRadius: 34,
    paddingVertical: 24,
    alignItems: "center",
    gap: 28,
  },
  logo: {
    fontSize: 28,
    marginBottom: 24,
  },
  webNavActive: {
    color: "#fff",
    backgroundColor: colors.navy,
    width: 42,
    height: 42,
    borderRadius: 14,
    textAlign: "center",
    lineHeight: 42,
    fontSize: 24,
  },
  webNav: {
    color: colors.navy,
    fontSize: 28,
  },
  webContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 18,
    marginRight: 18,
    marginBottom: 18,
    borderRadius: 34,
    padding: 28,
  },
  webTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  webPageTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#6B6B6B",
  },
  webGrid: {
    flexDirection: "row",
    gap: 28,
  },
  webLeftColumn: {
    flex: 1,
  },
  webRightColumn: {
    flex: 1,
  },
  webScoreCircle: {
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 12,
    borderColor: colors.navy,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  webMetricsRow: {
    flexDirection: "row",
    gap: 18,
  },
  webMetricCardDark: {
    flex: 1,
    height: 220,
    borderRadius: 28,
    backgroundColor: colors.navy,
    padding: 20,
    justifyContent: "space-between",
  },
  webMetricCardLight: {
    flex: 1,
    height: 220,
    borderRadius: 28,
    backgroundColor: colors.lightBlue,
    padding: 20,
  },
  webBadgesBox: {
    backgroundColor: colors.soft,
    padding: 24,
    borderRadius: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
  },
  webArticlesHeader: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webArticlesRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
    paddingBottom: 32,
  },

  mobileRoot: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  mobileContent: {
    margin: 18,
    paddingBottom: 95,
    backgroundColor: "#fff",
    borderRadius: 36,
    padding: 16,
  },
  mobilePageTitle: {
    fontSize: 24,
    color: "#6B6B6B",
    marginBottom: 14,
  },

  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.dark,
  },
  heroSub: {
    fontSize: 12,
    marginTop: 6,
  },
  bellButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.navy,
    marginTop: 24,
    marginBottom: 12,
  },
  mobileScoreCircle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 9,
    borderColor: colors.navy,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  scoreNumber: {
    fontSize: 76,
    fontWeight: "800",
    color: colors.navy,
  },
  scoreLabel: {
    fontSize: 34,
    color: colors.navy,
  },

  mobileMetricCardDark: {
    width: 154,
    height: 190,
    borderRadius: 28,
    backgroundColor: colors.navy,
    padding: 16,
    marginRight: 10,
    justifyContent: "space-between",
  },
  mobileMetricCardLight: {
    width: 154,
    height: 190,
    borderRadius: 28,
    backgroundColor: colors.lightBlue,
    padding: 16,
    marginRight: 10,
  },
  metricTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  metricTitleLight: {
    color: "#fff",
    fontWeight: "700",
  },
  miniCircle: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: "#F4F7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  metricBig: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  metricSmall: {
    color: "#fff",
    fontSize: 12,
  },
  moodText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },
  chartIcon: {
    color: "#fff",
    fontSize: 52,
    marginTop: 34,
  },

  mobileBadgesBox: {
    backgroundColor: colors.soft,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  badge: {
    width: 92,
    alignItems: "center",
  },
  badgeEmoji: {
    fontSize: 42,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.navy,
    textAlign: "center",
  },

  mobileArticlesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: colors.dark,
    fontSize: 12,
  },
  articleCard: {
    width: 220,
    height: 185,
    borderRadius: 24,
    backgroundColor: "#fff",
    padding: 18,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  articleImage: {
    fontSize: 60,
  },
  articleTag: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
  },
  articleTitle: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },

  bottomNav: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    height: 64,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navActiveMobile: {
    color: "#fff",
    backgroundColor: colors.navy,
    width: 24,
    height: 24,
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  navMobile: {
    color: colors.navy,
    fontSize: 24,
  },
});
