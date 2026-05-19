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