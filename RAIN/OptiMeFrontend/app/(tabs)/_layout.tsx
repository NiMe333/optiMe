import { Stack } from "expo-router";
import { Platform, View, useWindowDimensions } from "react-native";

import MobileBottomNav from "@/components/navigation/MobileBottomNav";

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const isMobileLayout = width < 1000;

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F8FC" }}>
      <Stack
        screenOptions={{
          headerShown: false,

          // Na telefonu naj bo občutek bolj SPA-like.
          // Nav ostane pri miru, vsebina se samo nežno zamenja.
          animation: Platform.OS === "web" ? "fade" : "fade",
          animationDuration: 160,

          contentStyle: {
            backgroundColor: "#F4F8FC",
          },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="care" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>

      {isMobileLayout && <MobileBottomNav />}
    </View>
  );
}
