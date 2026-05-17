import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AuthGuard() {
  const { isAuthenticated, user, authLoading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || authLoading) return;

    const firstSegment = segments[0];

    const isAuthRoute = firstSegment === "auth";
    const isUserRoute = firstSegment === "user";
    const isTabsRoute = firstSegment === "(tabs)";

    const hasFinishedForm = user?.formFinished === true;

    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/auth/login");
      return;
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace(hasFinishedForm ? "/(tabs)/home" : "/user/startingForm");
      return;
    }

    if (isAuthenticated && isUserRoute && hasFinishedForm) {
      router.replace("/(tabs)/home");
      return;
    }

    if (isAuthenticated && isTabsRoute && !hasFinishedForm) {
      router.replace("/user/startingForm");
      return;
    }
  }, [isReady, authLoading, isAuthenticated, user, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "web" ? "fade" : "slide_from_right",
        animationDuration: 300,
      }}
    >
      <Stack.Screen
        name="auth"
        options={{
          animation: Platform.OS === "web" ? "fade" : "slide_from_right",
        }}
      />

      <Stack.Screen
        name="user/startingForm"
        options={{
          animation: Platform.OS === "web" ? "fade" : "fade_from_bottom",
          animationDuration: 350,
        }}
      />

      <Stack.Screen
        name="(tabs)/home"
        options={{
          animation: "fade",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="(tabs)/index"
        options={{
          animation: "fade",
          animationDuration: 300,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGuard />
      </ToastProvider>
    </AuthProvider>
  );
}
