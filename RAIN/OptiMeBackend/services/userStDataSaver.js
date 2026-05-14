const UserStData = require('../models/userStDataModel');
const mongoose = require('mongoose');

async function newUserStDataModel()
{
    await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

    try
    {
        const userStData  = new UserStData({
            userId: "6a05fe492a7cf4be350a8eaa",
            storagePath: `userData/6a05fe492a7cf4be350a8eaa/2026-05-14.csv`,
            importedForDate: "2026-05-14"
        });

        await userStData.save();

        console.log("data created");
    }
    catch(err)
    {
        console.log("data creation failed", err);
    }
    finally 
    {
        await mongoose.disconnect();
    }
}

newUserStDataModel();
  