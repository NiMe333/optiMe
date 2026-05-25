import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_PEDOMETER_KEY = "pendingPedometerPayload";

export type PendingPedometerPayload = {
  topic: string;
  payload: {
    userId: string;
    steps: number;
    date: string;
    timestamp: string;
    source: string;
  };
};

export async function savePendingPedometerPayload(
  item: PendingPedometerPayload,
) {
  try {
    await AsyncStorage.setItem(PENDING_PEDOMETER_KEY, JSON.stringify(item));
    console.log("Saved pending pedometer payload:", item.payload.steps);
  } catch (err) {
    console.log("Could not save pending pedometer payload:", err);
  }
}

export async function getPendingPedometerPayload() {
  try {
    const raw = await AsyncStorage.getItem(PENDING_PEDOMETER_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PendingPedometerPayload;
  } catch (err) {
    console.log("Could not read pending pedometer payload:", err);
    return null;
  }
}

export async function clearPendingPedometerPayload() {
  try {
    await AsyncStorage.removeItem(PENDING_PEDOMETER_KEY);
  } catch (err) {
    console.log("Could not clear pending pedometer payload:", err);
  }
}
