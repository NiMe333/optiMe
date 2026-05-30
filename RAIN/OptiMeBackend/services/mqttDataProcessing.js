const mqtt = require("mqtt");
const mongoose = require("mongoose");
const UserDeviceStatus = require("../models/userDeviceStatusModel");
const UserSnapshot = require("../models/userSnapshotModel");

const MONGO_URI =
  "mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe";
const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";

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

  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid timestamp");
  }

  return {
    userId: userIdFromTopic,
    steps,
    startOfDay,
    startOfNextDay,
    timestamp,
    source: data.source || "pedometer",
  };
}

function parseHeartbeatMessage(topic, message) {
  const data = JSON.parse(message.toString());

  const topicParts = topic.split("/");

  if (
    topicParts.length !== 3 ||
    topicParts[0] !== "users" ||
    topicParts[2] !== "heartbeat"
  ) {
    throw new Error("Invalid heartbeat topic format");
  }

  const userIdFromTopic = topicParts[1];

  if (!mongoose.Types.ObjectId.isValid(userIdFromTopic)) {
    throw new Error("Invalid userId in heartbeat topic");
  }

  if (data.userId && data.userId !== userIdFromTopic) {
    throw new Error("userId in heartbeat payload does not match topic");
  }

  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid heartbeat timestamp");
  }

  return {
    userId: userIdFromTopic,
    deviceId: data.deviceId || "default-device",
    platform: data.platform || "unknown",
    source: data.source || "mqtt-heartbeat",
    timestamp,
  };
}

async function handleHeartbeatMessage(topic, message) {
  const data = parseHeartbeatMessage(topic, message);

  const updatedStatus = await UserDeviceStatus.findOneAndUpdate(
    {
      userId: data.userId,
      deviceId: data.deviceId,
    },
    {
      $set: {
        status: "online",
        lastHeartbeatAt: data.timestamp,
        platform: data.platform,
        source: data.source,
      },
      $setOnInsert: {
        userId: data.userId,
        deviceId: data.deviceId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  console.log("Heartbeat received:", {
    userId: updatedStatus.userId,
    deviceId: updatedStatus.deviceId,
    lastHeartbeatAt: updatedStatus.lastHeartbeatAt,
  });
}

function publishStepsAck(client, data, snapshot) {
  const ackTopic = `users/${data.userId}/steps/ack`;

  const ackPayload = {
    success: true,
    userId: data.userId,
    receivedSteps: data.steps,
    savedSteps: snapshot.steps,
    savedAt: new Date().toISOString(),
    requestTimestamp: data.timestamp.toISOString(),
    snapshotDate: snapshot.date,
  };

  client.publish(
    ackTopic,
    JSON.stringify(ackPayload),
    {
      qos: 0,
      retain: false,
    },
    (err) => {
      if (err) {
        console.error("MQTT ACK publish error:", err.message);
        return;
      }

      console.log("MQTT ACK published:", ackTopic);
    },
  );
}

async function connectMongo() {
  await mongoose.connect(MONGO_URI);

  console.log("MongoDB connected");
}

function connectMqtt() {
  console.log("Connecting to MQTT broker:", MQTT_URL);

  const client = mqtt.connect(MQTT_URL, {
    reconnectPeriod: 15000,
    connectTimeout: 10000,
  });

  client.on("connect", () => {
    console.log("Connected to MQTT broker:", MQTT_URL);

    client.subscribe(["users/+/steps", "users/+/heartbeat"], (err) => {
      if (err) {
        console.error("MQTT subscribe error:", err.message);
        return;
      }

      console.log("Subscribed to topics: users/+/steps, users/+/heartbeat");
    });
  });

  client.on("message", async (topic, message) => {
    try {
      if (topic.endsWith("/heartbeat")) {
        await handleHeartbeatMessage(topic, message);
        return;
      }

      const data = parseStepsMessage(topic, message);

      console.log("MQTT steps received:", {
        userId: data.userId,
        steps: data.steps,
        timestamp: data.timestamp,
      });

      const updatedSnapshot = await UserSnapshot.findOneAndUpdate(
        {
          userId: data.userId,
          date: {
            $gte: data.startOfDay,
            $lt: data.startOfNextDay,
          },
        },
        {
          $max: {
            steps: data.steps,
            lastPedometerSyncAt: data.timestamp,
          },
          $set: {
            pedometerSource: data.source,
          },
          $setOnInsert: {
            userId: data.userId,
            date: data.startOfDay,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );

      console.log("UserSnapshot updated:", {
        snapshotId: updatedSnapshot._id,
        savedSteps: updatedSnapshot.steps,
      });

      publishStepsAck(client, data, updatedSnapshot);
    } catch (err) {
      console.error("MQTT message error:", err.message);
    }
  });

  client.on("reconnect", () => {
    console.log("MQTT reconnecting...");
  });

  client.on("close", () => {
    console.log("MQTT connection closed");
  });

  let lastMqttErrorAt = 0;

  client.on("error", (err) => {
    const now = Date.now();

    if (now - lastMqttErrorAt > 30000) {
      console.error("MQTT client error:", err.message || err);
      lastMqttErrorAt = now;
    }
  });
}

async function start() {
  try {
    await connectMongo();
    connectMqtt();
  } catch (err) {
    console.error("MQTT processor failed to start:", err.message);
    process.exit(1);
  }
}

start();
