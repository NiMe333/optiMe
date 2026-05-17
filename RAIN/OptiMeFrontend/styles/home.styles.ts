import { Platform, StyleSheet } from "react-native";

export const colors = {
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

export const styles = StyleSheet.create({
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

  headerDate: {
    marginTop: 5,
    color: colors.navySoft,
    fontSize: 13,
    fontWeight: "800",
  },

  webTopRow: {
    flexDirection: "row",
    gap: 28,
    alignItems: "stretch",
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
    gap: 14,
  },

  mobileMetricGrid: {
    gap: 12,
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

  achievementBullet: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(24,63,104,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  achievementBulletText: {
    color: colors.green,
    fontSize: 17,
    fontWeight: "900",
  },

  articleImagePattern: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.45)",
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

  sparkline: {
    height: 44,
    marginTop: 6,
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
