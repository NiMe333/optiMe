const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');
const mongoose = require('mongoose');
const csvModel = require('../../models/csvDataModel');
const Stream = require('stream');

const columns = ['age', 'gender', 'education_level', 'employment_status', 'daily_screen_time_hours', 'sleep_hours', 'physical_activity_hrs', 'social_support_score', 'financial_stress', 'work_stress', 'anxiety_score', 'depression_score', 'stress_level'];

function pick(row) {
  const normalized = normalizeRow(row);

  return Object.fromEntries(
    columns
      .filter(col => normalized[col] !== undefined) //filter out only the cols that are defined
      .map(col => [col, normalized[col]]) //map runs a function on each element and return new array
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

function fileInput(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function run() { //async allows await which block the function until the promise (async methods always return a promise) is fulfilled
  await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

  const fileName = await fileInput("Enter CSV file name: ");

  const filePath = `scripts/dataProcessing/data/${fileName}`;

  let batch = [];
  const BATCH_SIZE = 100;

  const stream = fs.createReadStream(filePath)
    .pipe(csv()) //text -> object

    .on('data', (row) => {  //(row) holds parameter .on('data') runs for every row
     
      batch.push(pick(row));

      if (batch.length >= BATCH_SIZE) {
        stream.pause();

        const toInsert = [...batch];
        batch = [];

        csvModel.insertMany(toInsert)
          .then(() => {
            stream.resume(); 
          })
          .catch(err => console.error(err)); 
      }

    })
    .on('end', async () => { //.on('end') when all data is read
      try {
        if (batch.length) {
          await csvModel.insertMany(toInsertLover);
        }

        console.log('Import done');
      } catch (err) {
        console.error('Insert error:', err);
      } finally {
        process.exit();
      }
    })
}

run();