const os = require("os");
const fs = require("fs");
const path = require("path");

const API_PORT = process.env.API_PORT || "3000";
const MQTT_PORT = process.env.MQTT_PORT || "1883";
const MQTT_WS_PORT = process.env.MQTT_WS_PORT || "9001";

function isValidLocalIPv4(address) {
  if (!address) return false;

  return (
    address.startsWith("192.168.") ||
    address.startsWith("10.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(address)
  );
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();

  const ignoredNames = [
    "lo",
    "utun",
    "awdl",
    "llw",
    "bridge",
    "docker",
    "vboxnet",
    "vmnet",
  ];

  const candidates = [];

  for (const [name, infos] of Object.entries(interfaces)) {
    if (ignoredNames.some((ignored) => name.toLowerCase().includes(ignored))) {
      continue;
    }

    for (const info of infos || []) {
      if (
        info.family === "IPv4" &&
        !info.internal &&
        isValidLocalIPv4(info.address)
      ) {
        candidates.push({
          name,
          address: info.address,
        });
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error("Ni bilo mogoče najti lokalnega IP naslova.");
  }

  const preferred =
    candidates.find((item) => item.name === "en0") ||
    candidates.find((item) => item.name.toLowerCase().includes("wi-fi")) ||
    candidates.find((item) => item.name.toLowerCase().includes("wlan")) ||
    candidates[0];

  return preferred.address;
}

const forcedIp = process.env.HOST_IP;
const hostIp = forcedIp || getLocalIp();

const outputPath = path.join(
  __dirname,
  "..",
  "src",
  "config",
  "network.generated.ts",
);

const content = `// Auto-generated file.
// Ne urejaj ročno. Za posodobitev zaženi: npm run detect-ip

export const HOST_IP = "${hostIp}";

export const API_BASE_URL = "http://${hostIp}:${API_PORT}";

export const MQTT_HOST = "${hostIp}";
export const MQTT_PORT = ${Number(MQTT_PORT)};
export const MQTT_URL = "mqtt://${hostIp}:${MQTT_PORT}";

export const MQTT_WS_PORT = ${Number(MQTT_WS_PORT)};
export const MQTT_WS_URL = "ws://${hostIp}:${MQTT_WS_PORT}";

export const NETWORK_CONFIG = {
  hostIp: HOST_IP,
  apiBaseUrl: API_BASE_URL,
  mqttHost: MQTT_HOST,
  mqttPort: MQTT_PORT,
  mqttUrl: MQTT_URL,
  mqttWsPort: MQTT_WS_PORT,
  mqttWsUrl: MQTT_WS_URL,
} as const;
`;

console.log("MQTT WS URL:", `ws://${hostIp}:${MQTT_WS_PORT}`);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);

console.log("Host IP zaznan:", hostIp);
console.log("API URL:", `http://${hostIp}:${API_PORT}`);
console.log("MQTT URL:", `mqtt://${hostIp}:${MQTT_PORT}`);
console.log("Config zapisan v:", outputPath);
