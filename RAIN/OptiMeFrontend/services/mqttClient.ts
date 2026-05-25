import mqtt from "mqtt";
import { Platform } from "react-native";

const COMPUTER_IP = "192.168.0.20";

export const MQTT_URL =
  Platform.OS === "web" ? "ws://localhost:9001" : `ws://${COMPUTER_IP}:9001`;

type MqttConnectListener = () => void;

const connectListeners = new Set<MqttConnectListener>();

const client = mqtt.connect(MQTT_URL, {
  reconnectPeriod: 15000,
  connectTimeout: 10000,
  clean: true,
  resubscribe: true,
});

client.on("connect", () => {
  console.log("MQTT connected:", MQTT_URL);

  connectListeners.forEach((listener) => {
    listener();
  });
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

export function onMqttConnect(listener: MqttConnectListener) {
  connectListeners.add(listener);

  return () => {
    connectListeners.delete(listener);
  };
}

export function isMqttConnected() {
  return client.connected;
}

export function publishJson(topic: string, payload: object) {
  if (!client.connected) {
    console.log("MQTT not connected, publish skipped");
    return false;
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
      }
    },
  );

  return true;
}

export function subscribeJson<T>(
  topic: string,
  onMessage: (payload: T, topic: string) => void,
) {
  const messageHandler = (receivedTopic: string, message: Buffer) => {
    if (receivedTopic !== topic) {
      return;
    }

    try {
      const payload = JSON.parse(message.toString()) as T;
      onMessage(payload, receivedTopic);
    } catch (err) {
      console.log("MQTT JSON parse error:", err);
    }
  };

  client.on("message", messageHandler);

  client.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.log("MQTT subscribe error:", err.message);
      return;
    }

    console.log("MQTT subscribed:", topic);
  });

  return () => {
    client.off("message", messageHandler);

    if (client.connected) {
      client.unsubscribe(topic);
    }
  };
}

export default client;
