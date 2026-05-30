import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { publishJson, onMqttConnect } from "@/services/mqttClient";

const HEARTBEAT_INTERVAL_MS = 30000;

function getUserId(user: any) {
  return user?._id || user?.id || user?.userId;
}

function getDeviceId(userId: string) {
  return `${Platform.OS}-${userId}`;
}

export default function MqttHeartbeatTracker() {
  const { isAuthenticated, user, authLoading } = useAuth();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) return;

    const userId = getUserId(user);

    if (!userId) return;

    const deviceId = getDeviceId(userId);

    function sendHeartbeat() {
      publishJson(`users/${userId}/heartbeat`, {
        userId,
        deviceId,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
        source: "frontend-heartbeat",
      });
    }

    function startHeartbeat() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      sendHeartbeat();

      intervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, HEARTBEAT_INTERVAL_MS);
    }

    function stopHeartbeat() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    const unsubscribeMqttConnect = onMqttConnect(() => {
      sendHeartbeat();
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        const previousAppState = appStateRef.current;
        appStateRef.current = nextAppState;

        const wasInBackground =
          previousAppState === "background" || previousAppState === "inactive";

        if (nextAppState === "active" && wasInBackground) {
          startHeartbeat();
          return;
        }

        if (nextAppState === "background" || nextAppState === "inactive") {
          stopHeartbeat();
        }
      },
    );

    startHeartbeat();

    return () => {
      stopHeartbeat();
      unsubscribeMqttConnect();
      appStateSubscription.remove();
    };
  }, [authLoading, isAuthenticated, user]);

  return null;
}
