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
        <View style={styles.sidebar}>
          <Text style={styles.logo}>💙</Text>
          <View style={styles.navActive}>▦</View>
          <View style={styles.navItem}>📅</View>
          <View style={styles.navItem}>💬</View>
          <View style={styles.navItem}>📖</View>
          <View style={{ flex: 1 }} />
          <View style={styles.navItem}>?</View>
        </View>

        <ScrollView
          style={styles.webContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.webHeader}>
            <Text style={styles.webTitle}>
              Hey, Nik! Glad to have you back 🙌
            </Text>

            <Pressable onPress={handleLogout} style={styles.profilePill}>
              <Text>🔔</Text>
              <Text>⚙️</Text>
              <Text style={styles.avatar}>N</Text>
            </Pressable>
          </View>

          <View style={styles.webGrid}>
            <Card
              title="Progress Tracking"
              value="14"
              text="Therapy goals achieved over the last 3 months"
            />
            <Card
              title="Educational Sources"
              value="22"
              text="Breathing and meditation techniques"
            />
            <Card
              title="Therapeutic Sessions"
              value="6"
              text="Sessions were held this month"
            />

            <View style={[styles.card, styles.upcomingCard]}>
              <Text style={styles.cardTitle}>Upcoming</Text>
              <View style={styles.calendarRow}>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <Text key={d} style={styles.dayText}>
                    {d}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarRow}>
                {["21", "22", "23", "24", "25", "26", "27"].map((d) => (
                  <Text
                    key={d}
                    style={d === "22" ? styles.activeDate : styles.dateText}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              <Appointment
                name="Dr. McCoy"
                role="Psychotherapist"
                time="Today"
              />
              <Appointment
                name="Darlene Robertson"
                role="Family therapist"
                time="24 Aug"
              />
              <Appointment
                name="Dr. McCoy"
                role="Psychotherapist"
                time="28 Aug"
              />

              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  Schedule a new consultation
                </Text>
              </Pressable>
            </View>

            <View style={[styles.card, styles.chartCard]}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>Emotional State</Text>
                  <Text style={styles.muted}>
                    Based on data collected during sessions and self-tests
                  </Text>
                </View>
                <View style={styles.tabs}>
                  <Text style={styles.tabActive}>Week</Text>
                  <Text style={styles.tab}>Month</Text>
                  <Text style={styles.tab}>Year</Text>
                </View>
              </View>

              <View style={styles.barChart}>
                {[60, 55, 58, 75, 38, 45, 32].map((h, i) => (
                  <View key={i} style={styles.barWrap}>
                    <View style={[styles.bar, { height: h }]} />
                    <Text style={styles.barLabel}>{16 + i} Aug</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, styles.supportCard]}>
              <Text style={styles.supportTitle}>Urgent Support</Text>
              <Text style={styles.supportText}>
                Quick access to crisis hotlines when you need immediate help
              </Text>
              <Text style={styles.lotus}>🪷</Text>
              <Pressable style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Get help now</Text>
              </Pressable>
            </View>

            <View style={[styles.card, styles.exerciseCard]}>
              <Text style={styles.cardTitle}>My exercises</Text>
              <Text style={styles.muted}>
                Exercises to help maintain good physical health and support
                therapy progress
              </Text>

              <Exercise
                title="Gratitude journal"
                percent="98%"
                time="6h 32min"
                category="Positive thinking"
              />
              <Exercise
                title="The power of awareness"
                percent="55%"
                time="11h 40min"
                category="Mindfulness"
              />
            </View>

            <View style={[styles.card, styles.recordsCard]}>
              <Text style={styles.cardTitle}>Records of recent sessions</Text>
              <Text style={styles.muted}>
                View or download recordings of your sessions
              </Text>
              <Record title="Protecting personal space" time="45min" />
              <Record title="Respectful relationship s3" time="1h 7min" />
              <Record title="Respectful relationship s2" time="58 min" />
            </View>
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

        <View style={styles.mobileHero}>
          <View>
            <Text style={styles.mobileHeroTitle}>Hi, Nik!</Text>
            <Text style={styles.mobileHeroSub}>
              Your mind deserves care too.
            </Text>
          </View>

          <Pressable onPress={handleLogout} style={styles.bellButton}>
            <Text>🔔</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Mental Health Score</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>80</Text>
          <Text style={styles.scoreLabel}>Healthy</Text>
        </View>

        <Text style={styles.sectionTitle}>Mental Health Metrics</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.metricCardDark}>
            <Text style={styles.metricTitle}>Freud Score</Text>
            <Text style={styles.metricBig}>80</Text>
            <Text style={styles.metricSmall}>Healthy</Text>
          </View>

          <View style={styles.metricCardLight}>
            <Text style={styles.metricTitleLight}>Mood</Text>
            <Text style={styles.moodText}>Sad</Text>
            <Text style={styles.chartIcon}>▁▃▅▇▅▃</Text>
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Badges</Text>

        <View style={styles.badgesBox}>
          <Badge emoji="🌙" title="Sleep Balance" />
          <Badge emoji="📵" title="Digital Detox" />
          <Badge emoji="🧠" title="Active Mind" />
          <Badge emoji="☯️" title="Inner Balance" />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Mindful Articles</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Article title="The Hidden Impact of Screen Time on Your Mind" />
          <Article title="Better Sleep, Better Mind: Simple Changes" />
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Text style={styles.navActiveMobile}>⌂</Text>
        <Text style={styles.navMobile}>▥</Text>
        <Text style={styles.navMobile}>♡</Text>
        <Text style={styles.navMobile}>♙</Text>
      </View>
    </View>
  );
}

function Card({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>
        {value} <Text style={styles.positive}>+15%</Text>
      </Text>
      <Text style={styles.muted}>{text}</Text>
      <View style={styles.progressOuter}>
        <View style={styles.progressInner} />
      </View>
    </View>
  );
}

function Appointment({
  name,
  role,
  time,
}: {
  name: string;
  role: string;
  time: string;
}) {
  return (
    <View style={styles.appointment}>
      <Text style={styles.appAvatar}>👤</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.appName}>{name}</Text>
        <Text style={styles.mutedSmall}>{role}</Text>
      </View>
      <Text style={styles.appTime}>{time}</Text>
    </View>
  );
}

function Exercise({ title, percent, time, category }: any) {
  return (
    <View style={styles.exerciseRow}>
      <Text style={styles.exerciseIcon}>📝</Text>
      <Text style={styles.exerciseTitle}>{title}</Text>
      <Text>{percent}</Text>
      <View style={styles.smallProgress}>
        <View style={styles.smallProgressInner} />
      </View>
      <Text style={styles.mutedSmall}>{time}</Text>
      <Text style={styles.mutedSmall}>{category}</Text>
    </View>
  );
}

function Record({ title, time }: { title: string; time: string }) {
  return (
    <View style={styles.recordRow}>
      <Text style={styles.play}>▶</Text>
      <View>
        <Text style={styles.exerciseTitle}>{title}</Text>
        <Text style={styles.mutedSmall}>Dr. McCoy · {time}</Text>
      </View>
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
  navy: "#183F68",
  dark: "#453024",
  lightBlue: "#B8D5E9",
  bg: "#F7FAFD",
  soft: "#F5EFE9",
};

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EAF7FC",
  },
  sidebar: {
    width: 92,
    paddingVertical: 28,
    alignItems: "center",
    gap: 18,
  },
  logo: {
    fontSize: 26,
    marginBottom: 24,
  },
  navActive: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#152D5A",
    color: "#fff",
    textAlign: "center",
    lineHeight: 52,
    fontSize: 24,
  },
  navItem: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: 52,
    fontSize: 22,
  },
  webContent: {
    flex: 1,
    padding: 32,
  },
  webHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  webTitle: {
    fontSize: 34,
    fontWeight: "500",
    color: "#20242C",
  },
  profilePill: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D9EAF6",
    textAlign: "center",
    lineHeight: 34,
    fontWeight: "700",
  },
  webGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 22,
    padding: 22,
    minHeight: 150,
    width: "23.5%",
    shadowColor: "#6B88A8",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242833",
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 34,
    fontWeight: "600",
    color: "#151A22",
    marginBottom: 12,
  },
  positive: {
    fontSize: 14,
    color: "#49B05A",
  },
  muted: {
    fontSize: 14,
    color: "#697282",
    lineHeight: 20,
  },
  mutedSmall: {
    fontSize: 12,
    color: "#78808C",
  },
  progressOuter: {
    height: 26,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 18,
    overflow: "hidden",
  },
  progressInner: {
    width: "58%",
    height: "100%",
    backgroundColor: "#21B7E8",
    borderRadius: 20,
  },
  upcomingCard: {
    width: "23.5%",
    minHeight: 480,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  dayText: {
    color: "#6A7180",
  },
  dateText: {
    color: "#6A7180",
  },
  activeDate: {
    backgroundColor: "#22BCEB",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  appointment: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 12,
  },
  appAvatar: {
    fontSize: 30,
  },
  appName: {
    fontWeight: "700",
    color: "#252B35",
  },
  appTime: {
    color: "#252B35",
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 22,
    backgroundColor: "#142C5A",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  chartCard: {
    width: "47.5%",
    minHeight: 310,
  },
  supportCard: {
    width: "23.5%",
    minHeight: 310,
    backgroundColor: "#22BCEB",
  },
  supportTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  supportText: {
    color: "#EAF8FF",
    marginTop: 16,
    lineHeight: 22,
  },
  lotus: {
    fontSize: 82,
    textAlign: "right",
    marginTop: 22,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#fff",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tabActive: {
    borderWidth: 1,
    borderColor: "#5D6472",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tab: {
    backgroundColor: "#F4F6F8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    color: "#777",
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 28,
    marginTop: 34,
  },
  barWrap: {
    alignItems: "center",
  },
  bar: {
    width: 54,
    borderRadius: 12,
    backgroundColor: "#21B7E8",
  },
  barLabel: {
    marginTop: 10,
    color: "#7A828C",
    fontSize: 12,
  },
  exerciseCard: {
    width: "71.5%",
    minHeight: 230,
  },
  recordsCard: {
    width: "23.5%",
    minHeight: 230,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    marginTop: 24,
  },
  exerciseIcon: {
    fontSize: 22,
  },
  exerciseTitle: {
    fontWeight: "600",
    color: "#252B35",
    minWidth: 180,
  },
  smallProgress: {
    width: 86,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  smallProgressInner: {
    width: "60%",
    height: "100%",
    backgroundColor: "#21B7E8",
    borderRadius: 8,
  },
  recordRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 18,
  },
  play: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D8F2FF",
    textAlign: "center",
    lineHeight: 42,
  },

  mobileRoot: {
    flex: 1,
    backgroundColor: "#1F1F1F",
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
  mobileHero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  mobileHeroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.dark,
  },
  mobileHeroSub: {
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
  scoreCircle: {
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
  metricCardDark: {
    width: 154,
    height: 190,
    borderRadius: 28,
    backgroundColor: colors.navy,
    padding: 16,
    marginRight: 10,
    justifyContent: "space-between",
  },
  metricCardLight: {
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
  metricBig: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  metricSmall: {
    color: "#fff",
    textAlign: "center",
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
  badgesBox: {
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
