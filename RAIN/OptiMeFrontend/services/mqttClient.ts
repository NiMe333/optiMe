import mqtt from 'mqtt';

const client = mqtt.connect('ws://172.20.10.9:9001');

client.on('connect', () => {
  console.log('MQTT connected');
});

client.on('error', (err) => {
  console.log('MQTT error:', err);
});

export default client;