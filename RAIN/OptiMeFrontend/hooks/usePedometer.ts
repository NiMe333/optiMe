import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { Pedometer } from "expo-sensors";

import { useAuth } from "@/context/AuthContext";
import {
  publishJson,
  subscribeJson,
  onMqttConnect,
} from "@/services/mqttClient";
import { notifyPedometerSync } from "@/services/pedometerSyncEvents";

import {
  savePendingPedometerPayload,
  getPendingPedometerPayload,
  clearPendingPedometerPayload,
} from "@/services/pendingPedometerQueue";

const SYNC_INTERVAL_MS = 10000;

type StepsAckPayload = {
  success: boolean;
  userId: string;
  receivedSteps: number;
  savedSteps: number;
  savedAt: string;
  requestTimestamp: string;
  snapshotDate: string;
};

type PedometerPayload = {
  userId: string;
  steps: number;
  date: string;
  timestamp: string;
  source: string;
};

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getUserId(user: any) {
  return user?._id || user?.id || user?.userId;
}

export default function usePedometer() {
  const { user, authLoading } = useAuth();

  const [steps, setSteps] = useState(0);

  const latestStepsRef = useRef(0);
  const lastAckedStepsRef = useRef<number | null>(null);
  const lastPendingStepsRef = useRef<number | null>(null);

  const subscriptionRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateSubscriptionRef = useRef<any>(null);

  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);
  const isSyncingRef = useRef(false);
  const isFlushingPendingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (authLoading) return;
    if (!user) return;

    const userId = getUserId(user);

    if (!userId) {
      console.log("Pedometer skipped: userId missing");
      return;
    }

    if (Platform.OS === "web") {
      return;
    }

    let unsubscribeStepsAck: (() => void) | null = null;
    let unsubscribeMqttConnect: (() => void) | null = null;

    async function savePendingIfChanged(
      topic: string,
      payload: PedometerPayload,
    ) {
      if (lastPendingStepsRef.current === payload.steps) {
        return;
      }

      lastPendingStepsRef.current = payload.steps;

      await savePendingPedometerPayload({
        topic,
        payload,
      });

      console.log("Pedometer saved for retry:", payload.steps);
    }

    async function flushPendingPedometerPayload() {
      if (isFlushingPendingRef.current) {
        return;
      }

      isFlushingPendingRef.current = true;

      try {
        const pending = await getPendingPedometerPayload();

        if (!pending) {
          return;
        }

        const published = publishJson(pending.topic, pending.payload);

        if (published) {
          console.log(
            "Pending pedometer payload resent:",
            pending.payload.steps,
          );
        }
      } catch (err) {
        console.log("Could not flush pending pedometer payload:", err);
      } finally {
        isFlushingPendingRef.current = false;
      }
    }

    unsubscribeStepsAck = subscribeJson<StepsAckPayload>(
      `users/${userId}/steps/ack`,
      async (ack) => {
        if (!ack.success) {
          console.log("Steps ACK failed:", ack);
          return;
        }

        const savedSteps = Number(ack.savedSteps);

        if (!Number.isFinite(savedSteps)) {
          return;
        }

        latestStepsRef.current = Math.max(latestStepsRef.current, savedSteps);
        lastAckedStepsRef.current = latestStepsRef.current;
        lastPendingStepsRef.current = null;

        setSteps(latestStepsRef.current);

        notifyPedometerSync({
          steps: latestStepsRef.current,
          date: formatDateForApi(new Date(ack.snapshotDate)),
          timestamp: ack.savedAt,
        });

        await clearPendingPedometerPayload();

        console.log("Steps saved by backend:", latestStepsRef.current);
      },
    );

    unsubscribeMqttConnect = onMqttConnect(() => {
      void flushPendingPedometerPayload();
    });

    function stopWatcher() {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    }

    function stopInterval() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function stopEverything() {
      stopWatcher();
      stopInterval();
    }

    async function publishSteps(currentSteps: number, force = false) {
      if (!force && lastAckedStepsRef.current === currentSteps) {
        return;
      }

      const topic = `users/${userId}/steps`;

      const payload: PedometerPayload = {
        userId,
        steps: currentSteps,
        date: formatDateForApi(new Date()),
        timestamp: new Date().toISOString(),
        source: "pedometer",
      };

      const published = publishJson(topic, payload);

      if (published) {
        console.log("Pedometer sent:", currentSteps);
        return;
      }

      await savePendingIfChanged(topic, payload);
    }

    async function readTodaySteps() {
      const start = getStartOfToday();
      const end = new Date();

      const result = await Pedometer.getStepCountAsync(start, end);

      return result.steps || 0;
    }

    async function syncFromSystemAndPublish(force = false) {
      if (isSyncingRef.current) return;

      isSyncingRef.current = true;

      try {
        const systemSteps = await readTodaySteps();

        if (!isMountedRef.current) return;

        const bestSteps = Math.max(latestStepsRef.current, systemSteps);

        latestStepsRef.current = bestSteps;
        setSteps(bestSteps);

        await publishSteps(bestSteps, force);
      } catch (err) {
        console.log("Pedometer system check error:", err);
      } finally {
        isSyncingRef.current = false;
      }
    }

    async function startWatcherFromTodaySteps(forcePublish = true) {
      if (isStartingRef.current) return;

      isStartingRef.current = true;

      try {
        const available = await Pedometer.isAvailableAsync();

        if (!available) {
          console.log("Pedometer not available on this device");
          return;
        }

        const permission = await Pedometer.requestPermissionsAsync();

        if (!permission.granted) {
          console.log("Pedometer permission not granted");
          return;
        }

        stopWatcher();

        const baseSteps = await readTodaySteps();

        if (!isMountedRef.current) return;

        latestStepsRef.current = baseSteps;
        setSteps(baseSteps);

        await publishSteps(baseSteps, forcePublish);

        subscriptionRef.current = Pedometer.watchStepCount((result) => {
          const currentSteps = baseSteps + result.steps;

          if (currentSteps <= latestStepsRef.current) {
            return;
          }

          latestStepsRef.current = currentSteps;
          setSteps(currentSteps);

          // Tukaj NE shranjujemo pending payload.
          // Pošiljanje/shranjevanje se zgodi samo na 10s interval.
        });

        console.log("Pedometer watcher started");
      } catch (err) {
        console.log("Pedometer watcher start error:", err);
      } finally {
        isStartingRef.current = false;
      }
    }

    function startPublishInterval() {
      stopInterval();

      intervalRef.current = setInterval(() => {
        void syncFromSystemAndPublish(false);
      }, SYNC_INTERVAL_MS);
    }

    async function rebuildPedometer(forcePublish = true) {
      stopEverything();

      await new Promise((resolve) => setTimeout(resolve, 300));

      await flushPendingPedometerPayload();
      await startWatcherFromTodaySteps(forcePublish);

      startPublishInterval();
    }

    void rebuildPedometer(true);

    appStateSubscriptionRef.current = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          await rebuildPedometer(false);
        }
      },
    );

    return () => {
      isMountedRef.current = false;

      stopEverything();

      if (unsubscribeStepsAck) {
        unsubscribeStepsAck();
      }

      if (unsubscribeMqttConnect) {
        unsubscribeMqttConnect();
      }

      if (appStateSubscriptionRef.current) {
        appStateSubscriptionRef.current.remove();
        appStateSubscriptionRef.current = null;
      }
    };
  }, [authLoading, user]);

  return steps;
}
