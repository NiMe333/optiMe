import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "web" ? "fade" : "slide_from_right",
        animationDuration: 280,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          animation: Platform.OS === "web" ? "fade" : "slide_from_left",
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          animation: Platform.OS === "web" ? "fade" : "slide_from_right",
        }}
      />
    </Stack>
  );
}
