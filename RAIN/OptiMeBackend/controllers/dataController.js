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

        const value = (snapShot1.mood + snapShot1.stress + snapShot1.anxiety) / 3;
        const changeFromLastWeek = mentalHealthScore - ((snapShot2.mood + snapShot2.stress + snapShot2.anxiety) / 3);
        const mentalHealthScore = {
                value: value,
                label: "Healthy",
                status: "healthy",
                changeFromLastWeek: changeFromLastWeek
            };

        return res.json({
            success: true,
            message: "Mental health score retrieval successfull",
            mentalHealthScore
        });
    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            message: "mental health score retrival failed",
        });
    }
}

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
/*
exports.calculatedScoresData = async function (req, res) {
    try {

        const sleep_average = (snapShot1.sleepHours + snapShot2.sleepHours + snapShot3.sleepHours + snapShot4.sleepHours + snapShot5.sleepHours + snapShot6.sleepHours + snapShot7.sleepHours) / 7;
        const anxiety_signals = (snapShot1.anxiety + snapShot2.anxiety + snapShot3.anxiety + snapShot4.anxiety + snapShot5.anxiety + snapShot6.anxiety + snapShot7.anxiety) / 7;
        const mood_balance = (snapShot1.mood + snapShot2.mood + snapShot3.mood + snapShot4.mood + snapShot5.mood + snapShot6.mood + snapShot7.mood) / 7;
        const activity_average = (snapShot1.steps + snapShot2.steps + snapShot3.steps + snapShot4.steps + snapShot5.steps + snapShot6.steps + snapShot7.steps) / 7;
        const screen_time_average = (snapShot1.screenTimeHours + snapShot2.screenTimeHours + snapShot3.screenTimeHours + snapShot4.screenTimeHours + snapShot5.screenTimeHours + snapShot6.screenTimeHours + snapShot7.screenTimeHours) / 7;
        const stress_level = (snapShot1.stress + snapShot2.stress + snapShot3.stress + snapShot4.stress + snapShot5.stress + snapShot6.stress + snapShot7.stress) / 7;

        const sleep_array = sleepArray;
        const anxiety_array = anxietyArray;
        const mood_array = moodArray;
        const activity_array = stepsArray;
        const screen_time_array = screentimeArray;
        const stress_array = stressArray;

        return res.json({
            success: true,
            message: "Calculated scores retrieval successfull",
            sleep_average,
            sleep_array,
            anxiety_signals,
            anxiety_array,
            mood_balance,
            mood_array,
            activity_average,
            activity_array,
            screen_time_average,
            screen_time_array,
            stress_level,
            stress_array
        });

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            message: "Calculated scores retrival failed",
        });
    }
}

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

        const sleep = [snapShot1.sleepHours, snapShot2.sleepHours, snapShot3.sleepHours, snapShot4.sleepHours, snapShot5.sleepHours, snapShot6.sleepHours, snapShot7.sleepHours];
        const social_score = [snapShot1.anxiety, snapShot2.anxiety, snapShot3.anxiety, snapShot4.anxiety, snapShot5.anxiety, snapShot6.anxiety, snapShot7.anxiety];
        const movement = [snapShot1.steps, snapShot2.steps, snapShot3.steps, snapShot4.steps, snapShot5.steps, snapShot6.steps, snapShot7.steps];
        const screen_time = [snapShot1.screenTimeHours, snapShot2.screenTimeHours, snapShot3.screenTimeHours, snapShot4.screenTimeHours, snapShot5.screenTimeHours, snapShot6.screenTimeHours, snapShot7.screenTimeHours];
        const stress_level = [snapShot1.stress, snapShot2.stress, snapShot3.stress, snapShot4.stress, snapShot5.stress, snapShot6.stress, snapShot7.stress];

        return res.json({
            success: true,
            message: "Calculated scores retrieval successfull",
            sleep,
            social_score,
            movement,
            screen_time,
            stress_level
        });

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            message: "Calculated scores retrival failed",
        });
    }
}*/