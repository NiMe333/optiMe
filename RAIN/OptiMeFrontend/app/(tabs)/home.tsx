import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import WebSidebar from "@/components/navigation/WebSidebar";
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
        <View style={styles.webSidebarShell}>
          <WebSidebar />
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
    <SafeAreaView style={styles.mobileRoot} edges={["top", "left", "right"]}>
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

      <MobileBottomNav />
    </SafeAreaView>
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
const colors = {
  background: "#F4F8FC",
  white: "#FFFFFF",

  navy: "#183F68",
  navySoft: "#355C86",

  blue: "#6EC6E8",
  blueSoft: "#D9EEF8",

  text: "#233548",
  textSoft: "#6E8092",

  card: "rgba(255,255,255,0.78)",
  cardStrong: "#FFFFFF",

  border: "rgba(24,63,104,0.08)",
  shadow: "#B7D5E5",

  mobileDark: "#F4F8FC",
};

const styles = StyleSheet.create({
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
    backgroundColor: "transparent",
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
    fontWeight: "800",
    color: colors.text,
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
    borderWidth: 10,
    borderColor: colors.navy,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,

    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
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

    shadowColor: colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },

  webMetricCardLight: {
    flex: 1,
    height: 220,
    borderRadius: 28,
    backgroundColor: colors.blueSoft,
    padding: 20,

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
  },

  webBadgesBox: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,

    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
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
    backgroundColor: colors.mobileDark,
  },

  mobileContent: {
    marginHorizontal: 18,
    marginBottom: 18,
    paddingBottom: 105,
    backgroundColor: "#fff",
    borderRadius: 36,
    padding: 16,
  },

  mobilePageTitle: {
    fontSize: 24,
    color: "#6B6B6B",
    marginBottom: 14,
    fontWeight: "700",
  },

  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },

  heroSub: {
    fontSize: 13,
    marginTop: 6,
    color: colors.textSoft,
  },

  bellButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
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
    backgroundColor: "rgba(255,255,255,0.55)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,

    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },

  scoreNumber: {
    fontSize: 76,
    fontWeight: "900",
    color: colors.navy,
  },

  scoreLabel: {
    fontSize: 34,
    color: colors.navySoft,
  },

  mobileMetricCardDark: {
    width: 154,
    height: 190,
    borderRadius: 28,
    backgroundColor: colors.navy,
    padding: 16,
    marginRight: 10,
    justifyContent: "space-between",

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },

  mobileMetricCardLight: {
    width: 154,
    height: 190,
    borderRadius: 28,
    backgroundColor: colors.blueSoft,
    padding: 16,
    marginRight: 10,

    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
  },

  metricTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  metricTitleLight: {
    color: colors.navy,
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
    color: colors.navy,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },

  chartIcon: {
    color: colors.navy,
    fontSize: 52,
    marginTop: 34,
  },

  mobileBadgesBox: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,

    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
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
    color: colors.navySoft,
    fontSize: 12,
    fontWeight: "700",
  },

  articleCard: {
    width: 220,
    height: 185,
    borderRadius: 28,
    backgroundColor: colors.cardStrong,
    padding: 18,
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  articleImage: {
    fontSize: 60,
    color: colors.navy,
  },

  articleTag: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
  },

  articleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },
});
