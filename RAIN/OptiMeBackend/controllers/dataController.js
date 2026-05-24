var SnapshotModel = require("../models/userSnapshotModel");

async function getLatestSnapshots(userId) {
  const snapshots = await SnapshotModel.find({ userId })
    .sort({ date: -1 })
    .limit(7);

  return snapshots;
}

function getSnapshotAt(snapshots, index) {
  return snapshots[index] || snapshots[0] || {};
}

function getNumber(snapshot, field, fallback = 0) {
  const value = snapshot?.[field];

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  return fallback;
}

function getSocialConnection(snapshot) {
  return (
    getNumber(snapshot, "socialConnection", null) ??
    getNumber(snapshot, "socialization", null) ??
    getNumber(snapshot, "socialScore", null) ??
    getNumber(snapshot, "anxiety", 0)
  );
}

function buildArray(snapshots, field, fallback = 0) {
  return Array.from({ length: 7 }, (_, index) => {
    const snapshot = getSnapshotAt(snapshots, index);
    return getNumber(snapshot, field, fallback);
  });
}

function buildSocialArray(snapshots) {
  return Array.from({ length: 7 }, (_, index) => {
    const snapshot = getSnapshotAt(snapshots, index);
    return getSocialConnection(snapshot);
  });
}

function average(arr) {
  if (!arr.length) {
    return 0;
  }

  return Math.round(arr.reduce((sum, value) => sum + value, 0) / arr.length);
}

function calculateTrend(current, previous, higherIsGood = true) {
  if (!previous || previous === 0) {
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
  if (score >= 75) {
    return "Healthy";
  }

  if (score >= 40) {
    return "Moderate";
  }

  return "High Risk";
}

function getMentalHealthStatus(score) {
  if (score >= 75) {
    return "healthy";
  }

  if (score >= 40) {
    return "warning";
  }

  return "danger";
}

exports.mentalHealthData = async function (req, res) {
  try {
    const snapshots = await getLatestSnapshots(req.user.userId);

    if (!snapshots.length) {
      return res.status(404).json({
        success: false,
        message: "No snapshot data found for this user",
      });
    }

    const currentSnapshot = getSnapshotAt(snapshots, 0);
    const previousSnapshot = getSnapshotAt(snapshots, 1);

    const currentMood = getNumber(currentSnapshot, "mood");
    const currentStress = getNumber(currentSnapshot, "stress");
    const currentAnxiety = getNumber(currentSnapshot, "anxiety");

    const previousMood = getNumber(previousSnapshot, "mood", currentMood);
    const previousStress = getNumber(previousSnapshot, "stress", currentStress);
    const previousAnxiety = getNumber(
      previousSnapshot,
      "anxiety",
      currentAnxiety,
    );

    const currentScore =
      (currentMood * 20 +
        (6 - currentStress) * 20 +
        (6 - currentAnxiety) * 20) /
      3;

    const previousScore =
      (previousMood * 20 +
        (6 - previousStress) * 20 +
        (6 - previousAnxiety) * 20) /
      3;

    const changeFromLastWeek = currentScore - previousScore;

    const mentalHealthScore = {
      value: Math.round(currentScore),
      label: getMentalHealthLabel(currentScore),
      status: getMentalHealthStatus(currentScore),
      changeFromLastWeek: Math.round(changeFromLastWeek),
    };

    return res.json({
      success: true,
      message: "Mental health score retrieval successful",
      latestDate: snapshots[0]?.date ?? null,
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
    const snapshots = await getLatestSnapshots(req.user.userId);

    if (!snapshots.length) {
      return res.status(404).json({
        success: false,
        message: "No snapshot data found for this user",
      });
    }

    const snapShot1 = getSnapshotAt(snapshots, 0);
    const snapShot2 = getSnapshotAt(snapshots, 1);

    const sleepArray = buildArray(snapshots, "sleepHours");
    const activityArray = buildArray(snapshots, "steps");
    const screenTimeArray = buildArray(snapshots, "screenTimeHours");
    const socialArray = buildSocialArray(snapshots);
    const moodArray = buildArray(snapshots, "mood");
    const stressArray = buildArray(snapshots, "stress");

    const trackedMetrics = [
      {
        id: "sleep",
        title: "Sleep",
        value: getNumber(snapShot1, "sleepHours"),
        suffix: "h",
        subtitle: "Sleep hours",
        trend: calculateTrend(
          getNumber(snapShot1, "sleepHours"),
          getNumber(snapShot2, "sleepHours"),
          true,
        ),
        chart: sleepArray,
      },

      {
        id: "activity",
        title: "Activity",
        value: getNumber(snapShot1, "steps"),
        subtitle: "Steps from pedometer",
        trend: calculateTrend(
          getNumber(snapShot1, "steps"),
          getNumber(snapShot2, "steps"),
          true,
        ),
        chart: activityArray,
      },

      {
        id: "screen-time",
        title: "Screen Time",
        value: getNumber(snapShot1, "screenTimeHours"),
        suffix: "h",
        subtitle: "Device screen time",
        trend: calculateTrend(
          getNumber(snapShot1, "screenTimeHours"),
          getNumber(snapShot2, "screenTimeHours"),
          false,
        ),
        chart: screenTimeArray,
      },

      {
        id: "socialization",
        title: "Socialization",
        value: getSocialConnection(snapShot1),
        suffix: "/5",
        subtitle: "Social connection",
        trend: calculateTrend(
          getSocialConnection(snapShot1),
          getSocialConnection(snapShot2),
          true,
        ),
        chart: socialArray,
      },

      {
        id: "mood",
        title: "Mood",
        value: getNumber(snapShot1, "mood"),
        suffix: "/5",
        subtitle: "Mood check-in",
        trend: calculateTrend(
          getNumber(snapShot1, "mood"),
          getNumber(snapShot2, "mood"),
          true,
        ),
        chart: moodArray,
      },

      {
        id: "stress",
        title: "Stress",
        value: getNumber(snapShot1, "stress"),
        suffix: "/5",
        subtitle: "Baseline stress level",
        trend: calculateTrend(
          getNumber(snapShot1, "stress"),
          getNumber(snapShot2, "stress"),
          false,
        ),
        chart: stressArray,
      },
    ];

    return res.json({
      success: true,
      message: "Tracked metrics data retrieval successful",
      latestDate: snapshots[0]?.date ?? null,
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
    const snapshots = await getLatestSnapshots(req.user.userId);

    if (!snapshots.length) {
      return res.status(404).json({
        success: false,
        message: "No snapshot data found for this user",
      });
    }

    const anxietyArray = buildArray(snapshots, "anxiety");
    const moodArray = buildArray(snapshots, "mood");
    const stressArray = buildArray(snapshots, "stress");

    const anxietyScore = average(anxietyArray) * 20;
    const moodScore = average(moodArray) * 20;
    const stressScore = average(stressArray) * 20;

    const anxietyValue = 100 - anxietyScore;
    const stressValue = 100 - stressScore;
    const moodValue = moodScore;

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
        chart: anxietyArray.map((v) => 100 - v * 20),
      },

      {
        id: "stress-level",
        title: "Stress Level",
        value: stressStatus.level,
        subtitle: "Work, school and daily pressure",
        level: stressStatus.level,
        status: stressStatus.status,
        chart: stressArray.map((v) => 100 - v * 20),
      },

      {
        id: "mood-balance",
        title: "Mood Balance",
        value: moodValue,
        suffix: "/100",
        subtitle: "Mood, sleep and social signals",
        level: moodStatus.level,
        status: moodStatus.status,
        chart: moodArray.map((v) => v * 20),
      },
    ];

    return res.json({
      success: true,
      message: "Calculated scores retrieval successful",
      latestDate: snapshots[0]?.date ?? null,
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
    const snapshots = await getLatestSnapshots(req.user.userId);

    if (!snapshots.length) {
      return res.status(404).json({
        success: false,
        message: "No snapshot data found for this user",
      });
    }

    const sleepArray = buildArray(snapshots, "sleepHours");
    const socialArray = buildSocialArray(snapshots);
    const activityArray = buildArray(snapshots, "steps");
    const screenTimeArray = buildArray(snapshots, "screenTimeHours");
    const stressArray = buildArray(snapshots, "stress");

    const trends = [
      {
        id: "sleep",
        label: "Sleep (hrs)",
        data: sleepArray,
      },

      {
        id: "movement",
        label: "Movement (steps)",
        data: activityArray,
      },

      {
        id: "social-score",
        label: "Social Score",
        data: socialArray.map((s) => s * 20),
      },

      {
        id: "stress-level",
        label: "Stress Level",
        data: stressArray.map((s) => s * 20),
      },

      {
        id: "screen-time",
        label: "Screen Time (hrs)",
        data: screenTimeArray.map((s) => Math.round(s * 10)),
      },
    ];

    return res.json({
      success: true,
      message: "Trends retrieval successful",
      latestDate: snapshots[0]?.date ?? null,
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
