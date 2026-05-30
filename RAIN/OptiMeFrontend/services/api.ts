import { Platform } from "react-native";
import { API_BASE_URL, HOST_IP } from "@/src/config/network.generated";

const API_PORT = 3000;

const USE_ANDROID_EMULATOR = false;

export const API_URL =
  Platform.select({
    web: `http://localhost:${API_PORT}`,

    android: USE_ANDROID_EMULATOR
      ? `http://10.0.2.2:${API_PORT}`
      : API_BASE_URL,

    ios: API_BASE_URL,

    default: API_BASE_URL,
  }) || API_BASE_URL;

console.log("HOST_IP:", HOST_IP);
console.log("API_URL:", API_URL);
