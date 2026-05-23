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