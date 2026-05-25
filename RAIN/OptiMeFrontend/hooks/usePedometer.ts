import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { Pedometer } from "expo-sensors";

import { useAuth } from "@/context/AuthContext";
import { publishJson } from "@/services/mqttClient";
import { notifyPedometerSync } from "@/services/pedometerSyncEvents";

const SYNC_INTERVAL_MS = 10000; // za test, kasneje daj 15000 ali 30000

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
  const lastPublishedStepsRef = useRef<number | null>(null);

  const subscriptionRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateSubscriptionRef = useRef<any>(null);

  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (authLoading) return;

    if (!user) {
      console.log("Pedometer skipped: user not logged in");
      return;
    }

    const userId = getUserId(user);

    if (!userId) {
      console.log("Pedometer skipped: userId missing");
      return;
    }

    if (Platform.OS === "web") {
      console.log("Pedometer skipped: not available on web");
      return;
    }

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

    function publishSteps(currentSteps: number, force = false) {
      if (!force && lastPublishedStepsRef.current === currentSteps) {
        return;
      }

      lastPublishedStepsRef.current = currentSteps;

      const payload = {
        userId,
        steps: currentSteps,
        date: formatDateForApi(new Date()),
        timestamp: new Date().toISOString(),
        source: "pedometer",
      };

      publishJson(`users/${userId}/steps`, payload);

      notifyPedometerSync({
        steps: payload.steps,
        date: payload.date,
        timestamp: payload.timestamp,
      });

      console.log("Published pedometer steps:", currentSteps);
    }

    async function readTodaySteps() {
      const start = getStartOfToday();
      const end = new Date();

      const result = await Pedometer.getStepCountAsync(start, end);

      return result.steps || 0;
    }

    async function startWatcherFromTodaySteps(forcePublish = true) {
      if (isStartingRef.current) {
        return;
      }

      isStartingRef.current = true;

      try {
        console.log("Starting pedometer watcher...");

        const available = await Pedometer.isAvailableAsync();
        console.log("Pedometer available:", available);

        if (!available) {
          return;
        }

        const permission = await Pedometer.requestPermissionsAsync();
        console.log("Pedometer permission granted:", permission.granted);

        if (!permission.granted) {
          return;
        }

        stopWatcher();

        const baseSteps = await readTodaySteps();

        if (!isMountedRef.current) {
          return;
        }

        latestStepsRef.current = baseSteps;
        setSteps(baseSteps);

        console.log("Initial today steps:", baseSteps);

        publishSteps(baseSteps, forcePublish);

        subscriptionRef.current = Pedometer.watchStepCount((result) => {
          const currentSteps = baseSteps + result.steps;

          latestStepsRef.current = currentSteps;
          setSteps(currentSteps);

          console.log("Pedometer live update:", {
            baseSteps,
            deltaSteps: result.steps,
            currentSteps,
          });
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
        console.log("10s pedometer MQTT sync:", latestStepsRef.current);

        publishSteps(latestStepsRef.current);
      }, SYNC_INTERVAL_MS);
    }

    async function startPedometer() {
      await startWatcherFromTodaySteps(true);
      startPublishInterval();
    }

    startPedometer();

    appStateSubscriptionRef.current = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        console.log("AppState changed:", nextAppState);

        if (nextAppState === "active") {
          console.log("App active again, rebuilding pedometer watcher...");

          await startWatcherFromTodaySteps(true);
          startPublishInterval();
        }
      },
    );

    return () => {
      isMountedRef.current = false;

      stopEverything();

      if (appStateSubscriptionRef.current) {
        appStateSubscriptionRef.current.remove();
        appStateSubscriptionRef.current = null;
      }
    };
  }, [authLoading, user]);

  return steps;
}
