var SnapshotModel = require("../models/userSnapshotModel");

const DAYS_TO_SHOW = 7;

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function getDateKey(date) {
  const parsedDate = new Date(date);

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildDateWindow() {
  const today = startOfDay(new Date());
  const firstDay = addDays(today, -(DAYS_TO_SHOW - 1));

  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = addDays(firstDay, index);

    return {
      date,
      dateKey: getDateKey(date),
    };
  });
}

async function getDashboardDays(userId) {
  const dateWindow = buildDateWindow();

  const firstDate = dateWindow[0].date;
  const lastDate = dateWindow[dateWindow.length - 1].date;
  const endDate = addDays(lastDate, 1);

  const snapshots = await SnapshotModel.find({
    userId,
    date: {
      $gte: firstDate,
      $lt: endDate,
    },
  }).sort({ date: 1 });

  const snapshotMap = new Map();

  snapshots.forEach((snapshot) => {
    snapshotMap.set(getDateKey(snapshot.date), snapshot);
  });

  return dateWindow.map((day) => {
    const snapshot = snapshotMap.get(day.dateKey) || null;

    return {
      date: day.date,
      dateKey: day.dateKey,
      snapshot,
      hasData: !!snapshot,
    };
  });
}

function getDates(days) {
  return days.map((day) => day.dateKey);
}

function getHasDataByDate(days) {
  return days.map((day) => day.hasData);
}

function getNumber(day, field, fallback = null) {
  const value = day?.snapshot?.[field];

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  return fallback;
}

function getSocialConnection(day) {
  const value =
    getNumber(day, "socialConnection", null) ??
    getNumber(day, "socialization", null) ??
    getNumber(day, "socialScore", null);

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  return null;
}

function buildArray(days, field) {
  return days.map((day) => {
    if (!day.hasData) {
      return null;
    }

    return getNumber(day, field, null);
  });
}

function buildSocialArray(days) {
  return days.map((day) => {
    if (!day.hasData) {
      return null;
    }

    return getSocialConnection(day);
  });
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getPositiveScore(day, field) {
  if (!day.hasData) {
    return null;
  }

  const value = getNumber(day, field, null);

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return clampScore(value * 20);
}

function getInvertedScore(day, field) {
  if (!day.hasData) {
    return null;
  }

  const value = getNumber(day, field, null);

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return clampScore((6 - value) * 20);
}

function average(arr) {
  const numericValues = arr.filter(
    (value) => typeof value === "number" && !Number.isNaN(value),
  );

  if (!numericValues.length) {
    return null;
  }

  return Math.round(
    numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length,
  );
}

function calculateTrend(current, previous, higherIsGood = true) {
  if (
    typeof current !== "number" ||
    typeof previous !== "number" ||
    Number.isNaN(current) ||
    Number.isNaN(previous) ||
    previous === 0
  ) {
    return {
      direction: "same",
      value: 0,
      isGood: true,
    };
  }

  const diff = current - previous;
  const percent = Math.abs(Math.round((diff / previous) * 100));

  return {
    direction: diff > 0 ? "up" : diff < 0 ? "down" : "same",
    value: percent,
    isGood: higherIsGood ? diff >= 0 : diff <= 0,
  };
}

function getStatus(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return {
      level: "No data",
      status: "warning",
    };
  }

  if (score >= 70) {
    return {
      level: "Healthy",
      status: "healthy",
    };
  }

  if (score >= 40) {
    return {
      level: "Moderate",
      status: "warning",
    };
  }

  return {
    level: "High",
    status: "danger",
  };
}

function getMentalHealthLabel(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return "No data";
  }

  if (score >= 75) {
    return "Healthy";
  }

  if (score >= 40) {
    return "Moderate";
  }

  return "High Risk";
}

function getMentalHealthStatus(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return "warning";
  }

  if (score >= 75) {
    return "healthy";
  }

  if (score >= 40) {
    return "warning";
  }

  return "danger";
}

function calculateMentalHealthScore(day) {
  if (!day.hasData) {
    return null;
  }

  const scores = [
    getPositiveScore(day, "mood"),
    getInvertedScore(day, "stress"),
    getInvertedScore(day, "anxiety"),
  ].filter((value) => typeof value === "number" && !Number.isNaN(value));

  if (!scores.length) {
    return null;
  }

  return Math.round(
    scores.reduce((sum, value) => sum + value, 0) / scores.length,
  );
}

function multiplyOrNull(value, multiplier) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.round(value * multiplier);
}

exports.mentalHealthData = async function (req, res) {
  try {
    const days = await getDashboardDays(req.user.userId);

    const today = days[days.length - 1];
    const previousDay = days[days.length - 2] || today;

    const currentScore = calculateMentalHealthScore(today);
    const previousScore = calculateMentalHealthScore(previousDay);

    const hasCurrentScore = typeof currentScore === "number";
    const hasPreviousScore = typeof previousScore === "number";

    const mentalHealthScore = {
      value: hasCurrentScore ? currentScore : null,
      label: getMentalHealthLabel(currentScore),
      status: getMentalHealthStatus(currentScore),
      changeFromLastWeek:
        hasCurrentScore && hasPreviousScore
          ? currentScore - previousScore
          : null,
    };

    return res.json({
      success: true,
      message: "Mental health score retrieval successful",
      dates: getDates(days),
      hasDataByDate: getHasDataByDate(days),
      mentalHealthScore,
    });
  } catch (err) {
    console.log("Mental health score error:", err);

    return res.status(500).json({
      success: false,
      message: "Mental health score retrieval failed",
      error: err.message,
    });
  }
};

exports.trackedMetricsData = async function (req, res) {
  try {
    const days = await getDashboardDays(req.user.userId);

    const dates = getDates(days);
    const today = days[days.length - 1];
    const previousDay = days[days.length - 2] || today;

    const sleepArray = buildArray(days, "sleepHours");
    const activityArray = buildArray(days, "steps");
    const screenTimeArray = buildArray(days, "screenTimeHours");
    const socialArray = buildSocialArray(days);
    const moodArray = buildArray(days, "mood");
    const stressArray = buildArray(days, "stress");

    const trackedMetrics = [
      {
        id: "sleep",
        title: "Sleep",
        value: getNumber(today, "sleepHours", null),
        suffix: "h",
        subtitle: "Sleep hours",
        trend: calculateTrend(
          getNumber(today, "sleepHours", null),
          getNumber(previousDay, "sleepHours", null),
          true,
        ),
        chart: sleepArray,
        dates,
      },
      {
        id: "activity",
        title: "Activity",
        value: getNumber(today, "steps", null),
        subtitle: "Steps from pedometer",
        trend: calculateTrend(
          getNumber(today, "steps", null),
          getNumber(previousDay, "steps", null),
          true,
        ),
        chart: activityArray,
        dates,
      },
      {
        id: "screen-time",
        title: "Screen Time",
        value: getNumber(today, "screenTimeHours", null),
        suffix: "h",
        subtitle: "Device screen time",
        trend: calculateTrend(
          getNumber(today, "screenTimeHours", null),
          getNumber(previousDay, "screenTimeHours", null),
          false,
        ),
        chart: screenTimeArray,
        dates,
      },
      {
        id: "socialization",
        title: "Socialization",
        value: getSocialConnection(today),
        suffix: "/5",
        subtitle: "Social connection",
        trend: calculateTrend(
          getSocialConnection(today),
          getSocialConnection(previousDay),
          true,
        ),
        chart: socialArray,
        dates,
      },
      {
        id: "mood",
        title: "Mood",
        value: getNumber(today, "mood", null),
        suffix: "/5",
        subtitle: "Mood check-in",
        trend: calculateTrend(
          getNumber(today, "mood", null),
          getNumber(previousDay, "mood", null),
          true,
        ),
        chart: moodArray,
        dates,
      },
      {
        id: "stress",
        title: "Stress",
        value: getNumber(today, "stress", null),
        suffix: "/5",
        subtitle: "Baseline stress level",
        trend: calculateTrend(
          getNumber(today, "stress", null),
          getNumber(previousDay, "stress", null),
          false,
        ),
        chart: stressArray,
        dates,
      },
    ];

    return res.json({
      success: true,
      message: "Tracked metrics data retrieval successful",
      dates,
      hasDataByDate: getHasDataByDate(days),
      trackedMetrics,
    });
  } catch (err) {
    console.log("Tracked metrics error:", err);

    return res.status(500).json({
      success: false,
      message: "Tracked metrics retrieval failed",
      error: err.message,
    });
  }
};

exports.calculatedScoresData = async function (req, res) {
  try {
    const days = await getDashboardDays(req.user.userId);

    const dates = getDates(days);

    const anxietyChart = days.map((day) => getInvertedScore(day, "anxiety"));
    const stressChart = days.map((day) => getInvertedScore(day, "stress"));
    const moodChart = days.map((day) => getPositiveScore(day, "mood"));

    const anxietyValue = average(anxietyChart);
    const stressValue = average(stressChart);
    const moodValue = average(moodChart);

    const anxietyStatus = getStatus(anxietyValue);
    const stressStatus = getStatus(stressValue);
    const moodStatus = getStatus(moodValue);

    const calculatedScores = [
      {
        id: "anxiety-signals",
        title: "Anxiety Signals",
        value: anxietyValue,
        suffix: "/100",
        subtitle: "Based on recent patterns",
        level: anxietyStatus.level,
        status: anxietyStatus.status,
        chart: anxietyChart,
        dates,
      },
      {
        id: "stress-level",
        title: "Stress Level",
        value: stressStatus.level,
        subtitle: "Work, school and daily pressure",
        level: stressStatus.level,
        status: stressStatus.status,
        chart: stressChart,
        dates,
      },
      {
        id: "mood-balance",
        title: "Mood Balance",
        value: moodValue,
        suffix: "/100",
        subtitle: "Mood, sleep and social signals",
        level: moodStatus.level,
        status: moodStatus.status,
        chart: moodChart,
        dates,
      },
    ];

    return res.json({
      success: true,
      message: "Calculated scores retrieval successful",
      dates,
      hasDataByDate: getHasDataByDate(days),
      calculatedScores,
    });
  } catch (err) {
    console.log("Calculated scores error:", err);

    return res.status(500).json({
      success: false,
      message: "Calculated scores retrieval failed",
      error: err.message,
    });
  }
};

exports.trendsData = async function (req, res) {
  try {
    const days = await getDashboardDays(req.user.userId);

    const dates = getDates(days);

    const sleepArray = buildArray(days, "sleepHours");
    const socialArray = buildSocialArray(days);
    const activityArray = buildArray(days, "steps");
    const screenTimeArray = buildArray(days, "screenTimeHours");
    const stressArray = buildArray(days, "stress");

    const trends = [
      {
        id: "sleep",
        label: "Sleep (hrs)",
        data: sleepArray,
        dates,
      },
      {
        id: "movement",
        label: "Movement (steps)",
        data: activityArray,
        dates,
      },
      {
        id: "social-score",
        label: "Social Score",
        data: socialArray.map((value) => multiplyOrNull(value, 20)),
        dates,
      },
      {
        id: "stress-level",
        label: "Stress Level",
        data: stressArray.map((value) => multiplyOrNull(value, 20)),
        dates,
      },
      {
        id: "screen-time",
        label: "Screen Time (hrs)",
        data: screenTimeArray.map((value) => multiplyOrNull(value, 10)),
        dates,
      },
    ];

    return res.json({
      success: true,
      message: "Trends retrieval successful",
      dates,
      hasDataByDate: getHasDataByDate(days),
      trends,
    });
  } catch (err) {
    console.log("Trends error:", err);

    return res.status(500).json({
      success: false,
      message: "Trends retrieval failed",
      error: err.message,
    });
  }
};
