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

### Terminal 5 - test

mosquitto_pub -h 127.0.0.1 -p 1883 -t users/6a0a09bf38dbbc2f6a65d41b/steps -m '{"userId":"6a0a09bf38dbbc2f6a65d41b","steps":2222,"date":"2026-05-25"}'
