const mqtt = require("mqtt");
const UserSnapshot = require("../models/userSnapshotModel");
const mongoose = require("mongoose");

function getDayRange(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const startOfNextDay = new Date(startOfDay);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);

  return {
    startOfDay,
    startOfNextDay,
  };
}

function parseStepsMessage(topic, message) {
  const data = JSON.parse(message.toString());

  const topicParts = topic.split("/");

  if (
    topicParts.length !== 3 ||
    topicParts[0] !== "users" ||
    topicParts[2] !== "steps"
  ) {
    throw new Error("Invalid topic format");
  }

  const userIdFromTopic = topicParts[1];

  if (!mongoose.Types.ObjectId.isValid(userIdFromTopic)) {
    throw new Error("Invalid userId in topic");
  }

  if (data.userId && data.userId !== userIdFromTopic) {
    throw new Error("userId in payload does not match userId in topic");
  }

  const steps = Number(data.steps);

  if (!Number.isFinite(steps) || steps < 0) {
    throw new Error("Invalid steps value");
  }

  const { startOfDay, startOfNextDay } = getDayRange(data.date);

  return {
    userId: userIdFromTopic,
    steps,
    startOfDay,
    startOfNextDay,
  };
}

async function connectMongo() {
  await mongoose.connect(
    "mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe",
  );
  console.log("MongoDB connected");
}

function connectMqtt() {
  const client = mqtt.connect("mqtt://localhost:1883");

  client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe("users/+/steps", (err) => {
      if (err) {
        console.error("MQTT subscribe error:", err.message);
        return;
      }

      console.log("Subscribed to topic: users/+/steps");
    });
  });

  client.on("message", async (topic, message) => {
    try {
      const data = parseStepsMessage(topic, message);

      console.log("MQTT message received");
      console.log("Topic:", topic);
      console.log("User ID:", data.userId);
      console.log("Steps:", data.steps);
      console.log("Start of day:", data.startOfDay);

      const result = await UserSnapshot.updateOne(
        {
          userId: data.userId,
          date: {
            $gte: data.startOfDay,
            $lt: data.startOfNextDay,
          },
        },
        {
          $set: {
            steps: data.steps,
          },
          $setOnInsert: {
            userId: data.userId,
            date: data.startOfDay,
          },
        },
        {
          upsert: true,
        },
      );

      console.log("UserSnapshot updated");
      console.log("Matched:", result.matchedCount);
      console.log("Modified:", result.modifiedCount);
      console.log("Upserted:", result.upsertedCount);
    } catch (err) {
      console.error("MQTT message error:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT client error:", err.message);
  });
}

async function start() {
  try {
    await connectMongo();
    connectMqtt();
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
}

start();
