# RAIN

## MQTT

1. terminal
   /opt/homebrew/opt/mosquitto/sbin/mosquitto -v -c ~/mosquitto-dev.conf

2. terminal
   node ./RAIN/OptiMeBackend/services/mqttDataProcessing.js

3. terminal
   mosquitto_pub -h 127.0.0.1 -p 1883 -t users/6a0a09bf38dbbc2f6a65d41b/steps -m '{"userId":"6a0a09bf38dbbc2f6a65d41b","steps":2222,"date":"2026-05-25"}'
