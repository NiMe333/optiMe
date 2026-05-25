import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { colors, styles } from "@/styles/home.styles";

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isWebLayout = width >= 1000;

  const { logout } = useAuth();
  const { showToast, showConfirmToast } = useToast();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function blurWebFocus() {
    if (Platform.OS !== "web") return;

    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();
  }

  async function logoutConfirmed() {
    if (isLoggingOut) return;

    blurWebFocus();
    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
      setIsLoggingOut(false);
    }
  }

  function handleLogout() {
    blurWebFocus();

    showConfirmToast({
      message: "Do you want to log out?",
      type: "info",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: logoutConfirmed,
    });
  }

  if (isWebLayout) {
    return (
      <ScrollView
        style={styles.webContent}
        contentContainerStyle={styles.webContentInner}
        showsVerticalScrollIndicator={false}
      >
        <ProfileContent onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.mobileRoot} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContent}
      >
        <ProfileContent
          mobile
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileContent({
  mobile = false,
  onLogout,
  isLoggingOut,
}: {
  mobile?: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: mobile ? 22 : 24,
        borderWidth: 1,
        borderColor: colors.border,
        padding: mobile ? 18 : 24,
        minHeight: 260,
      }}
    >
      <Text
        style={{
          color: colors.navy,
          fontSize: mobile ? 24 : 30,
          fontWeight: "900",
        }}
      >
        Profile
      </Text>

      <Text
        style={{
          color: colors.textSoft,
          fontSize: 14,
          fontWeight: "700",
          marginTop: 8,
          lineHeight: 21,
        }}
      >
        Manage your account and app settings.
      </Text>

      <Pressable
        onPress={onLogout}
        disabled={isLoggingOut}
        style={{
          marginTop: 28,
          height: 54,
          borderRadius: 18,
          backgroundColor: "rgba(239,83,80,0.08)",
          borderWidth: 1,
          borderColor: "rgba(239,83,80,0.16)",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          opacity: isLoggingOut ? 0.6 : 1,
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={isLoggingOut ? "#C9A2A2" : "#EF5350"}
        />

        <Text
          style={{
            color: isLoggingOut ? "#C9A2A2" : "#EF5350",
            fontSize: 15,
            fontWeight: "900",
          }}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Text>
      </Pressable>
    </View>
  );
}
