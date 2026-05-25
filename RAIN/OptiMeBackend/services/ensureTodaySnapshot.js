const mongoose = require("mongoose");
const UserSnapshot = require("../models/userSnapshotModel");

const TEST_USER_ID = "6a0a09bf38dbbc2f6a65d41b";

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function createNormalTestSnapshot(userId, date) {
  return {
    userId,
    date,

    mood: randomInt(3, 5),
    stress: randomInt(1, 4),
    anxiety: randomInt(1, 3),

    sleepHours: randomFloat(6.2, 8.5, 1),
    steps: 0,
    screenTimeHours: randomFloat(2.5, 6.5, 1),
    socialConnection: randomInt(3, 5),

    lastPedometerSyncAt: new Date(),
    pedometerSource: "startup-seed",
  };
}

async function ensureTodaySnapshot() {
  const userId = new mongoose.Types.ObjectId(TEST_USER_ID);

  const todayStart = startOfDay(new Date());
  const tomorrowStart = addDays(todayStart, 1);

  const existingSnapshot = await UserSnapshot.findOne({
    userId,
    date: {
      $gte: todayStart,
      $lt: tomorrowStart,
    },
  });

  if (existingSnapshot) {
    console.log("Today UserSnapshot already exists:", existingSnapshot._id);
    return;
  }

  const snapshotData = createNormalTestSnapshot(userId, todayStart);

  const createdSnapshot = await UserSnapshot.create(snapshotData);

  console.log("Created today test UserSnapshot:", createdSnapshot._id);
  console.log("Seeded test values:", {
    mood: createdSnapshot.mood,
    stress: createdSnapshot.stress,
    anxiety: createdSnapshot.anxiety,
    sleepHours: createdSnapshot.sleepHours,
    steps: createdSnapshot.steps,
    screenTimeHours: createdSnapshot.screenTimeHours,
    socialConnection: createdSnapshot.socialConnection,
  });
}

module.exports = ensureTodaySnapshot;
