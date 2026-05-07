const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const logModel = require('../models/dailyLogsModel');
const Stream = require('stream');

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



async function run() { 
  await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

  const filePath = `services/iphone_realtime_daily_usage.csv`;

  let totalTime = 0;

  const stream = fs.createReadStream(filePath)
    .pipe(csv()) 

    .on('data', (row) => {  
        
      const pickedRow = pick(row);

      const date = pickedRow.date;

      if (date == "2026-04-07")
      {
        totalTime += parseFloat(pickedRow.daily_total_hours);
      }

    })
    .on('end', async () => { 
      try {
        
         const log = new logModel({

            userId: "69fc73e6ee18eab42b5f5c05",

            mentalHealthParameters: [
                {
                    screenTimeHours: totalTime
                }
            ]

        });

        await log.save();

        console.log('Import done');
      } catch (err) {
        console.error('Insert error:', err);
      } finally {
        process.exit();
      }
    })
}

run();