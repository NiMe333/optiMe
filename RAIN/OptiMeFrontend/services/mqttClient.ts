import mqtt from "mqtt";
import { Platform } from "react-native";

const COMPUTER_IP = "192.168.0.20";

export const MQTT_URL =
  Platform.OS === "web" ? "ws://localhost:9001" : `ws://${COMPUTER_IP}:9001`;

const client = mqtt.connect(MQTT_URL, {
  reconnectPeriod: 3000,
  connectTimeout: 10000,
  clean: true,
});

client.on("connect", () => {
  console.log("MQTT connected:", MQTT_URL);
});

client.on("reconnect", () => {
  console.log("MQTT reconnecting...");
});

client.on("error", (err) => {
  console.log("MQTT error:", err.message);
});

client.on("close", () => {
  console.log("MQTT connection closed");
});

export function publishJson(topic: string, payload: object) {
  if (!client.connected) {
    console.log("MQTT not connected yet, skipping publish");
    return;
  }

  client.publish(
    topic,
    JSON.stringify(payload),
    {
      qos: 0,
      retain: false,
    },
    (err) => {
      if (err) {
        console.log("MQTT publish error:", err.message);
        return;
      }

      console.log("MQTT published:", topic, payload);
    },
  );
}

export default client;
