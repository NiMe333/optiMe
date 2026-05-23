var SnapshotModel = require('../models/userSnapshotModel');

exports.mentalHealthData = async function (req, res) {
    try {

        const snapShot = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });

        const mentalHealthScore = (snapShot.mood + snapShot.stress + snapShot.anxiety) / 3;

        return res.json({
            success: true,
            message: "mental health score retrieval successfull",
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
        
        const snapShot = await SnapshotModel.findOne({
            userId: req.user.userId,
            date: new Date("2026-05-14")
        });

        const sleep = snapShot.sleepHours;
        const anxiety = snapShot.anxiety;
        const mood = snapShot.mood;
        const activity = snapShot.steps;
        const screentime = snapShot.screenTimeHours;
        const stress = snapShot.stress;

        return res.json({
            success: true,
            message: "Tracked metrics data retrieval successfull",
            sleep,
            anxiety,
            mood,
            activity,
            screentime,
            stress
        });

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            message: "Tracked metrics retrival failed",
        });
    }
}

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

        const sleepAvg = (snapShot1.sleepHours + snapShot2.sleepHours + snapShot3.sleepHours + snapShot4.sleepHours + snapShot5.sleepHours + snapShot6.sleepHours + snapShot7.sleepHours) / 7;
        const anxietyAvg = (snapShot1.anxiety + snapShot2.anxiety + snapShot3.anxiety + snapShot4.anxiety + snapShot5.anxiety + snapShot6.anxiety + snapShot7.anxiety) / 7;
        const moodAvg = (snapShot1.mood + snapShot2.mood + snapShot3.mood + snapShot4.mood + snapShot5.mood + snapShot6.mood + snapShot7.mood) / 7;
        const activityAvg = (snapShot1.steps + snapShot2.steps + snapShot3.steps + snapShot4.steps + snapShot5.steps + snapShot6.steps + snapShot7.steps) / 7;
        const screentimeAvg = (snapShot1.screenTimeHours + snapShot2.screenTimeHours + snapShot3.screenTimeHours + snapShot4.screenTimeHours + snapShot5.screenTimeHours + snapShot6.screenTimeHours + snapShot7.screenTimeHours) / 7;
        const stressAvg = (snapShot1.stress + snapShot2.stress + snapShot3.stress + snapShot4.stress + snapShot5.stress + snapShot6.stress + snapShot7.stress) / 7;

        return res.json({
            success: true,
            message: "Calculated scores retrieval successfull",
            sleepAvg,
            anxietyAvg,
            moodAvg,
            activityAvg,
            screentimeAvg,
            stressAvg
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

