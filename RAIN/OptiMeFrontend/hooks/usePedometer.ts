import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import { notifyPedometerSync } from "@/services/pedometerSyncEvents";
import { useAuth } from "@/context/AuthContext";
import { publishJson } from "@/services/mqttClient";

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

  useEffect(() => {
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

    let subscription: any = null;
    let publishInterval: ReturnType<typeof setInterval> | null = null;
    let appStateSubscription: any = null;
    let isMounted = true;

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

    function startWatchingFrom(baseSteps: number) {
      if (subscription) {
        subscription.remove();
      }

      subscription = Pedometer.watchStepCount((result) => {
        const currentSteps = baseSteps + result.steps;

        latestStepsRef.current = currentSteps;
        setSteps(currentSteps);
      });
    }

    async function syncTodaySteps(forcePublish = false) {
      try {
        const currentSteps = await readTodaySteps();

        if (!isMounted) return;

        latestStepsRef.current = currentSteps;
        setSteps(currentSteps);

        publishSteps(currentSteps, forcePublish);

        startWatchingFrom(currentSteps);
      } catch (err) {
        console.log("Could not sync today's steps:", err);
      }
    }

    async function startPedometer() {
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

        console.log("Pedometer started for user:", userId);

        await syncTodaySteps(true);

        publishInterval = setInterval(() => {
          publishSteps(latestStepsRef.current);
        }, 15000);

        appStateSubscription = AppState.addEventListener(
          "change",
          async (nextAppState) => {
            if (nextAppState === "active") {
              console.log("App returned to foreground, syncing steps...");
              await syncTodaySteps(true);
            }
          },
        );
      } catch (err) {
        console.log("Pedometer error:", err);
      }
    }

    startPedometer();

    return () => {
      isMounted = false;

      if (subscription) {
        subscription.remove();
      }

      if (publishInterval) {
        clearInterval(publishInterval);
      }

      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, [authLoading, user]);

  return steps;
}
