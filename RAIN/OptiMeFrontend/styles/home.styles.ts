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

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
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
    gap: 14,
  },

  metricCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "31%",
    minWidth: 245,
    minHeight: 155,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },

  mobileMetricGrid: {
    gap: 12,
  },

  mobileMetricCard: {
    width: "100%",
    minHeight: 165,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },

  metricTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  metricTitleBadge: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },

  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  metricTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "900",
    flexShrink: 1,
  },

  metricDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },

  metricBody: {
    flex: 1,
    marginTop: 8,
  },

  metricStatsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },

  metricPrimaryBlock: {
    flex: 1,
  },

  metricSecondaryBlock: {
    alignItems: "flex-end",
  },

  metricSecondaryLabel: {
    color: colors.navySoft,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 2,
    textTransform: "capitalize",
  },

  metricSecondaryValue: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  metricChartBox: {
    marginTop: 10,
    height: 54,
    width: "100%",
    overflow: "hidden",
  },

  metricTextBlock: {
    flex: 1,
    minWidth: 0,
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
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
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
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  metricSubtitle: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  metricBarBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },

  metricBarTextSide: {
    width: 82,
    justifyContent: "center",
  },

  metricBarChartSide: {
    flex: 1,
    minWidth: 130,
    justifyContent: "center",
  },

  screenTimeBarBody: {
    marginTop: 4,
    alignItems: "center",
  },

  screenTimeBarTextSide: {
    width: 64,
  },

  screenTimeBarChartSide: {
    flex: 1,
    minWidth: 0,
  },

  metricValueOnlyWrapper: {
    flex: 1,
    paddingTop: 8,
    gap: 10,
    justifyContent: "space-between",
  },

  metricValueOnlyMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  metricValueOnlyInfo: {
    flex: 1,
    minWidth: 0,
  },

  metricValueOnlyKicker: {
    color: colors.textSoft,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  metricValueOnlyValueLarge: {
    color: colors.navy,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -0.9,
  },

  metricValueOnlyLabelLarge: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 0,
  },

  metricValueOnlyHint: {
    color: colors.textSoft,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 9,
  },

  metricValueOnlyGoalPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    alignSelf: "flex-start",
  },

  metricValueOnlyGoalLabel: {
    color: colors.textSoft,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  metricValueOnlyGoalValue: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
    marginTop: 1,
  },

  metricValueOnlyProgressBlock: {
    gap: 6,
  },

  metricValueOnlyProgressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(24, 63, 104, 0.08)",
    overflow: "hidden",
  },

  metricValueOnlyProgressFill: {
    height: "100%",
    borderRadius: 999,
  },

  metricValueOnlyProgressText: {
    color: colors.textSoft,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
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

  trackedMetricContent: {
    marginTop: 8,
  },

  trackedAverageBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  trackedMainValueBlock: {
    minWidth: 86,
  },

  trackedDoubleBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  trackedDoubleItem: {
    flex: 1,
  },

  trackedDoubleDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(24,63,104,0.12)",
  },

  trackedScoreBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  trackedProgressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(24,63,104,0.08)",
    overflow: "hidden",
    marginTop: 10,
  },

  trackedProgressFill: {
    height: "100%",
    borderRadius: 999,
  },

  trackedScoreChartRow: {
    marginTop: 8,
  },

  trackedMiniChart: {
    height: 42,
    minWidth: 92,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 4,
  },

  trackedMiniChartCompact: {
    height: 28,
    minWidth: "100%",
    justifyContent: "flex-start",
  },

  trackedMiniChartColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  trackedMiniChartBar: {
    width: 5,
    borderRadius: 999,
  },

  valueOnlyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 14,
  },

  valueOnlyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  valueOnlyIcon: {
    fontSize: 26,
    fontWeight: "900",
  },

  valueOnlyValue: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.navy,
    letterSpacing: -1,
  },

  valueOnlyLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSoft,
  },

  barChartDetailPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(24,63,104,0.06)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5,
  },

  barChartDetailDay: {
    color: colors.navy,
    fontSize: 9,
    fontWeight: "900",
  },

  barChartDetailValue: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  barChartTopValue: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 2,
  },
});
