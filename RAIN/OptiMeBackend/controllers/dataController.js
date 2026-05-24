var SnapshotModel = require('../models/userSnapshotModel');

exports.mentalHealthData = async function (req, res) {
    try {

        const snapShot1 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });

        const snapShot2 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-13")
        });

        const currentScore = (snapShot1.mood * 20 + snapShot1.stress * 20 + snapShot1.anxiety * 20) / 3;
        const lastWeekScore = (snapShot2.mood * 20 + snapShot2.stress * 20 + snapShot2.anxiety * 20) / 3;
        const changeFromLastWeek = (currentScore - lastWeekScore);

        const mentalHealthScore = {
            value: Math.round(currentScore),
            label: currentScore >= 75 ? "Healthy"
                 : currentScore >= 40 ? "Moderate"
                 : "High Risk",

            status: currentScore >= 75 ? "healthy"
                  : currentScore >= 40 ? "warning"
                  : "danger",

            changeFromLastWeek: Math.round(changeFromLastWeek)
        };

        return res.json({
            success: true,
            message: "Mental health score retrieval successful",
            mentalHealthScore
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Mental health score retrieval failed",
            error: err.message
        });
    }
};

exports.trackedMetricsData = async function (req, res) {
    try {

        const snapShot1 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });
        const snapShot2 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-13")
        });
        const snapShot3 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-12")
        });
        const snapShot4 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-11")
        });
        const snapShot5 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-10")
        });
        const snapShot6 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-09")
        });
        const snapShot7 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-08")
        });

        // helper funkcija za trend
        const calculateTrend = (current, previous) => {
            if (!previous || previous === 0) {
                return {
                    direction: "same",
                    value: 0,
                    isGood: true
                };
            }

            const diff = current - previous;
            const percent = Math.abs(Math.round((diff / previous) * 100));

            return {
                direction:
                    diff > 0 ? "up" :
                    diff < 0 ? "down" :
                    "same",

                value: percent,

                isGood: diff >= 0
            };
        };

        const trackedMetrics = [
            {
                id: "sleep",
                title: "Sleep",
                value: snapShot1.sleepHours,
                suffix: "h",
                subtitle: "Sleep hours",
                trend: calculateTrend(
                    snapShot1.sleepHours,
                    snapShot2.sleepHours
                ),
                chart: [snapShot1.sleepHours, snapShot2.sleepHours, snapShot3.sleepHours, snapShot4.sleepHours, snapShot5.sleepHours, snapShot6.sleepHours, snapShot7.sleepHours]
            },

            {
                id: "activity",
                title: "Activity",
                value: snapShot1.steps,
                subtitle: "Steps from pedometer",
                trend: calculateTrend(
                    snapShot1.steps,
                    snapShot2.steps
                ),
                chart: [snapShot1.steps, snapShot2.steps, snapShot3.steps, snapShot4.steps, snapShot5.steps, snapShot6.steps, snapShot7.steps]
            },

            {
                id: "screen-time",
                title: "Screen Time",
                value: snapShot1.screenTimeHours,
                suffix: "h",
                subtitle: "Device screen time",
                trend: calculateTrend(
                    snapShot1.screenTimeHours,
                    snapShot2.screenTimeHours
                ),
                chart: [snapShot1.screenTimeHours, snapShot2.screenTimeHours, snapShot3.screenTimeHours, snapShot4.screenTimeHours, snapShot5.screenTimeHours, snapShot6.screenTimeHours, snapShot7.screenTimeHours]
            },

            {
                id: "socialization",
                title: "Socialization",
                value: snapShot1.anxiety,
                suffix: "/5",
                subtitle: "Social connection",
                trend: calculateTrend(
                    snapShot1.anxiety,
                    snapShot2.anxiety
                ),
                chart: [snapShot1.anxiety, snapShot2.anxiety, snapShot3.anxiety, snapShot4.anxiety, snapShot5.anxiety, snapShot6.anxiety, snapShot7.anxiety]
            },

            {
                id: "mood",
                title: "Mood",
                value: snapShot1.mood,
                suffix: "/5",
                subtitle: "Mood check-in",
                trend: calculateTrend(
                    snapShot1.mood,
                    snapShot2.mood
                ),
                chart: [snapShot1.mood, snapShot2.mood, snapShot3.mood, snapShot4.mood, snapShot5.mood, snapShot6.mood, snapShot7.mood]
            },

            {
                id: "stress",
                title: "Stress",
                value: snapShot1.stress,
                suffix: "/5",
                subtitle: "Baseline stress level",
                trend: calculateTrend(
                    snapShot1.stress,
                    snapShot2.stress
                ),
                chart: [snapShot1.stress, snapShot2.stress, snapShot3.stress, snapShot4.stress, snapShot5.stress, snapShot6.stress, snapShot7.stress]
            }
        ];

        return res.json({
            success: true,
            message: "Tracked metrics data retrieval successful",
            trackedMetrics
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Tracked metrics retrieval failed"
        });
    }
};

exports.calculatedScoresData = async function (req, res) {
    try {

        const snapShot1 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });
        const snapShot2 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-13")
        });
        const snapShot3 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-12")
        });
        const snapShot4 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-11")
        });
        const snapShot5 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-10")
        });
        const snapShot6 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-09")
        });
        const snapShot7 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-08")
        });

        // helper funkcija
        const average = (arr) =>
            Math.round(
                arr.reduce((sum, value) => sum + value, 0) / arr.length
            );

        // arrays
        const anxietyArray = [snapShot1.anxiety, snapShot2.anxiety, snapShot3.anxiety, snapShot4.anxiety, snapShot5.anxiety, snapShot6.anxiety, snapShot7.anxiety];
        const moodArray = [snapShot1.mood, snapShot2.mood, snapShot3.mood, snapShot4.mood, snapShot5.mood, snapShot6.mood, snapShot7.mood];
        const stressArray = [snapShot1.stress, snapShot2.stress, snapShot3.stress, snapShot4.stress, snapShot5.stress, snapShot6.stress, snapShot7.stress];

        // primer "score" pretvorbe
        const anxietyScore = average(anxietyArray) * 20;
        const moodScore = average(moodArray) * 20;
        const stressScore = average(stressArray) * 20;

        // helper za status
        const getStatus = (score) => {

            if (score >= 70) {
                return {
                    level: "Healthy",
                    status: "healthy"
                };
            }

            if (score >= 40) {
                return {
                    level: "Moderate",
                    status: "warning"
                };
            }

            return {
                level: "High",
                status: "danger"
            };
        };

        const anxietyStatus = getStatus(100 - anxietyScore);
        const moodStatus = getStatus(moodScore);
        const stressStatus = getStatus(100 - stressScore);

        const calculatedScores = [

            {
                id: "anxiety-signals",
                title: "Anxiety Signals",
                value: 100 - anxietyScore,
                suffix: "/100",
                subtitle: "Based on recent patterns",
                level: anxietyStatus.level,
                status: anxietyStatus.status,
                chart: anxietyArray.map(v => v * 20)
            },

            {
                id: "stress-level",
                title: "Stress Level",
                value: stressStatus.level,
                subtitle: "Work, school and daily pressure",
                level: stressStatus.level,
                status: stressStatus.status,
                chart: stressArray.map(v => v * 20)
            },

            {
                id: "mood-balance",
                title: "Mood Balance",
                value: moodScore,
                suffix: "/100",
                subtitle: "Mood, sleep and social signals",
                level: moodStatus.level,
                status: moodStatus.status,
                chart: moodArray.map(v => v * 20)
            }
        ];

        return res.json({
            success: true,
            message: "Calculated scores retrieval successful",
            calculatedScores
        });

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            message: "Calculated scores retrieval failed",
        });
    }
};

exports.trendsData = async function (req, res) {
    try {

        const snapShot1 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });
        const snapShot2 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-13")
        });
        const snapShot3 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-12")
        });
        const snapShot4 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-11")
        });
        const snapShot5 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-10")
        });
        const snapShot6 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-09")
        });
        const snapShot7 = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-08")
        });

        const sleepArray = [snapShot1.sleepHours, snapShot2.sleepHours, snapShot3.sleepHours, snapShot4.sleepHours, snapShot5.sleepHours, snapShot6.sleepHours, snapShot7.sleepHours];
        const anxietyArray = [snapShot1.anxiety, snapShot2.anxiety, snapShot3.anxiety, snapShot4.anxiety, snapShot5.anxiety, snapShot6.anxiety, snapShot7.anxiety];
        const activityArray = [snapShot1.steps, snapShot2.steps, snapShot3.steps, snapShot4.steps, snapShot5.steps, snapShot6.steps, snapShot7.steps];
        const screentimeArray = [snapShot1.screenTimeHours, snapShot2.screenTimeHours, snapShot3.screenTimeHours, snapShot4.screenTimeHours, snapShot5.screenTimeHours, snapShot6.screenTimeHours, snapShot7.screenTimeHours];
        const stressArray = [snapShot1.stress, snapShot2.stress, snapShot3.stress, snapShot4.stress, snapShot5.stress, snapShot6.stress, snapShot7.stress];

        const trends = [

            {
                id: "sleep",
                label: "Sleep (hrs)",
                data: sleepArray
            },

            {
                id: "movement",
                label: "Movement (steps)",
                // če želiš manjše številke za chart
                //data: activityArray.map(s => Math.round(s / 100))
                data: activityArray
            },

            {
                id: "social-score",
                label: "Social Score",
                data: anxietyArray.map(s => s * 20)
            },

            {
                id: "stress-level",
                label: "Stress Level",
                data: stressArray.map(s => s * 20)
            },

            {
                id: "screen-time",
                label: "Screen Time (hrs)",
                data: screentimeArray.map(s => Math.round(s * 10)
                )
            }
        ];

        return res.json({
            success: true,
            message: "Trends retrieval successful",
            trends
        });

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Trends retrieval failed",
            error: err.message
            
        });
    }
};