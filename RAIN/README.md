# RAIN

## MQTT

### Terminal 1 - MQTT broker

/opt/homebrew/opt/mosquitto/sbin/mosquitto -v -c ~/mosquitto-dev.conf

### Terminal 2 - backend API

cd ./RAIN/OptiMeBackend
npm run dev

### Terminal 3 - MQTT processor

cd ./RAIN/OptiMeBackend
npm run mqtt

### Terminal 4 - frontend

cd ./RAIN/OptiMeFrontend
npx expo start

### Terminal 5 - subscriber

mosquitto_sub -h 127.0.0.1 -p 1883 -t 'users/+/steps/ack' -v
