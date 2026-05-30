const app = require("./app");
const mongoose = require("mongoose");
const ensureTodaySnapshot = require("./services/ensureTodaySnapshot");

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe",
    );

    console.log("MongoDB connected");

    await ensureTodaySnapshot();

    app.listen(3000, "0.0.0.0", function () {
      console.log("listening on 3000");
    });
  } catch (err) {
    console.log("Backend startup error:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
