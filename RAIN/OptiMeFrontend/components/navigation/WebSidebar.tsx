import { Image, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const colors = {
  background: "#F4F8FC",
  white: "#FFFFFF",
  navy: "#183F68",
  navySoft: "#355C86",
  blue: "#6EC6E8",
  blueSoft: "#D9EEF8",
  text: "#233548",
  textSoft: "#6E8092",
  border: "rgba(24,63,104,0.08)",
  shadow: "#B7D5E5",
  danger: "#EF5350",
};

export default function WebSidebar() {
  const { logout } = useAuth();
  const { showToast, showConfirmToast } = useToast();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logoutConfirmed() {
    if (isLoggingOut) return;

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
    showConfirmToast({
      message: "Do you want to log out?",
      type: "info",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: logoutConfirmed,
    });
  }

  return (
    <View style={styles.sidebar}>
      <View style={styles.top}>
        <Image
          source={require("@/assets/images/just_circle.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.center}>
        <Pressable style={styles.activeItem}>
          <Ionicons name="home" size={24} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="stats-chart-outline" size={27} color={colors.navy} />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="heart-outline" size={28} color={colors.navy} />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="person-outline" size={28} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.item}>
          <Ionicons name="settings-outline" size={24} color={colors.navy} />
        </Pressable>

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={[styles.logoutItem, isLoggingOut && styles.logoutItemDisabled]}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={isLoggingOut ? "#C9A2A2" : colors.danger}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 92,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 34,

    borderWidth: 1,
    borderColor: colors.border,

    paddingVertical: 28,
    alignItems: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },

    elevation: 8,
  },

  top: {
    alignItems: "center",
  },

  logo: {
    width: 50,
    height: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 34,
  },

  bottom: {
    alignItems: "center",
    gap: 18,
  },

  activeItem: {
    width: 50,
    height: 50,
    borderRadius: 18,

    backgroundColor: colors.navy,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },

  item: {
    width: 50,
    height: 50,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  logoutItem: {
    width: 50,
    height: 50,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(239,83,80,0.08)",
  },

  logoutItemDisabled: {
    opacity: 0.6,
  },
});
