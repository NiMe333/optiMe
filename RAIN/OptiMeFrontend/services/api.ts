import { Platform } from "react-native";

const COMPUTER_IP = "192.168.0.20";
const API_PORT = 3000;

const USE_ANDROID_EMULATOR = false;

export const API_URL =
  Platform.select({
    web: `http://localhost:${API_PORT}`,
    android: USE_ANDROID_EMULATOR
      ? `http://10.0.2.2:${API_PORT}`
      : `http://${COMPUTER_IP}:${API_PORT}`,
    ios: `http://${COMPUTER_IP}:${API_PORT}`,
    default: `http://${COMPUTER_IP}:${API_PORT}`,
  }) || `http://${COMPUTER_IP}:${API_PORT}`;

console.log("API_URL:", API_URL);
