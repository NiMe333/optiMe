/* const fs = require('fs');
const csv = require('csv-parser');
const Stream = require('stream');
const UserSnapshot = require('../models/userSnapshotModel');
const UserStData = require('../models/userStDataModel');
const mongoose = require('mongoose');

const columns = ['date', 'daily_total_hours'];

function pick(row) {
  const normalized = normalizeRow(row);

  return Object.fromEntries(
    columns
      .filter(col => normalized[col] !== undefined) 
      .map(col => [col, normalized[col]]) 
       
  );
}

function normalizeRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );
}

async function processImport(docs) {

  return new Promise((resolve, reject) => {

    let totalTime = 0;

    fs.createReadStream(docs.storagePath)
      .pipe(csv())

      .on('data', (row) => {

        const pickedRow = pick(row);

        if (pickedRow.date === "2026-04-07") {
          totalTime += parseFloat(pickedRow.daily_total_hours);
        }

      })

      .on('end', async () => {

        try {

          await UserSnapshot.updateOne(
            {
              userId: docs.userId,
              date: new Date(docs.importedForDate)
            },
            {
              $set: {
                screenTimeHours: totalTime
              }
            },
            { upsert: true } //if no doc create it
          );

          resolve();

        } catch (err) {

          reject(err);

        }

      });

  });
}

async function run() {

  await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

  const userStDataDocs = await UserStData.find({ isProcessed: false });

  for (const stDatadocs of userStDataDocs) {
    await processImport(stDatadocs);
    await UserStData.updateOne(
      {
         _id: stDatadocs._id
      },
      {
         $set: { isProcessed: true } 
      }
    ); 
  }

  await mongoose.disconnect();

  console.log("All stDataDocs processed");

}

run();*/

const fs = require('fs');
const csv = require('csv-parser');
const UserSnapshot = require('../models/userSnapshotModel');
const UserStData = require('../models/userStDataModel');
const mongoose = require('mongoose');

function normalizeRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );
}

function normalizeDate(dateInput) {

  const d = new Date(dateInput);

  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  ));
}

async function processIOSImport(docs) {

  return new Promise((resolve, reject) => {

    let totalTime = 0;
    let foundDailyTotal = false;

    console.log(docs.storagePath);
    fs.createReadStream(docs.storagePath)

      .on('error', (err) => {
        console.error(
          `File read failed: ${docs.storagePath}`,
          err
        );

        reject(err);
      })

      .pipe(csv())

      .on('data', (row) => {

        const normalized = normalizeRow(row);

        // iOS CSV že vsebuje daily_total_hours
        if (
          normalized.daily_total_hours &&
          !foundDailyTotal
        ) {
          totalTime = parseFloat(normalized.daily_total_hours);
          foundDailyTotal = true;
        }

      })

      .on('end', async () => {

        try {

          await UserSnapshot.updateOne(
            {
              userId: docs.userId,
              date: normalizeDate(docs.importedForDate)
            },
            {
              $set: {
                screenTimeHours: totalTime
              }
            },
            { upsert: true }
          );

          console.log(
            `iOS processed -> ${docs.storagePath} -> ${totalTime}h`
          );

          resolve();

        } catch (err) {

          reject(err);

        }

      });

  });
}

async function processAndroidImport(docs) {

  return new Promise((resolve, reject) => {

    let totalMinutes = 0;

    // prepreči duplicate package vrstice
    // Samsung dumpsys pogosto vrne več enakih zapisov
    const uniquePackages = new Map();

    console.log(docs.storagePath);
    fs.createReadStream(docs.storagePath)

      .on('error', (err) => {
        console.error(
          `File read failed: ${docs.storagePath}`,
          err
        );

        reject(err);
      })

      .pipe(csv())

      .on('data', (row) => {

        const normalized = normalizeRow(row);

        const packageName = normalized.package_name;

        const appMinutes = parseFloat(
          String(normalized.total_minutes || 0)
            .replace(',', '.')
        );

        if (!packageName || isNaN(appMinutes)) {
          return;
        }

        // obdrži največji usage za package
        // ker dumpsys pogosto duplicira app vrstice
        if (!uniquePackages.has(packageName)) {

          uniquePackages.set(packageName, appMinutes);

        } else {

          const existing = uniquePackages.get(packageName);

          if (appMinutes > existing) {
            uniquePackages.set(packageName, appMinutes);
          }
        }

      })

      .on('end', async () => {

        try {

          for (const minutes of uniquePackages.values()) {
            totalMinutes += minutes;
          }

          const totalHours = Number(
            (totalMinutes / 60).toFixed(2)
          );

          await UserSnapshot.updateOne(
            {
              userId: docs.userId,
              date: normalizeDate(docs.importedForDate)
            },
            {
              $set: {
                screenTimeHours: totalHours
              }
            },
            { upsert: true }
          );

          console.log(
            `Android processed -> ${docs.storagePath} -> ${totalHours}h`
          );

          resolve();

        } catch (err) {

          reject(err);

        }

      });

  });
}

async function processImport(docs) {

  const osType = docs.typeOfOS?.toLowerCase();

  if (osType === 'ios') {

    return processIOSImport(docs);

  } else if (osType === 'android') {

    return processAndroidImport(docs);

  } else {

    throw new Error(
      `Unsupported OS type: ${docs.typeOfOS}`
    );
  }
}

async function run() {

  await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

  const userStDataDocs = await UserStData.find({
    isProcessed: false
  });
  //const userStDataDocs = await UserStData.find();
  //console.log(userStDataDocs);

  console.log(
    `Najdenih ${userStDataDocs.length} neprocesiranih CSV datotek`
  );

  for (const stDatadocs of userStDataDocs) {

    try {

      await processImport(stDatadocs);

      await UserStData.updateOne(
        {
          _id: stDatadocs._id
        },
        {
          $set: {
            isProcessed: true
          }
        }
      );

      console.log(
        `Marked processed -> ${stDatadocs._id}`
      );

    } catch (err) {

      console.error(
        `Processing failed for ${stDatadocs.storagePath}`,
        err
      );
    }
  }

  await mongoose.disconnect();

  console.log('All stDataDocs processed');
}

run();