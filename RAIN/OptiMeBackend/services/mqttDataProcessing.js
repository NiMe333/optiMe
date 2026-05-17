const mqtt = require('mqtt')
const UserSnapshot = require('../models/userSnapshotModel');
const mongoose = require('mongoose');


async function start() {
  await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe')
  console.log('MongoDB connected')
}

const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  console.log('Connected to MQTT broker')

  client.subscribe('users/+/steps') //topic you are subscribed to
})

client.on('message', async (topic, message) => {
  try {

    const data = JSON.parse(message.toString()) //becomes normal object

    console.log('Topic:', topic)
    console.log('Payload:', data)

    const result = await UserSnapshot.updateOne(
            {
              userId: data.userId,
              date: new Date(data.date)
            },
            {
              $set: {
                steps: data.steps
              }
            },
          );

    console.log("UserSnapShot updated")
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

  } catch (err) {

    console.error('Invalid JSON:', err)

  }
})

start();