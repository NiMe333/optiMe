import { Image, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  mainNavigationItems,
  sidebarBottomNavigationItems,
} from "@/constants/navigationItems";

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
  const pathname = usePathname();

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
        <Pressable onPress={() => router.push("/home")}>
          <Image
            source={require("@/assets/images/just_circle.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.center}>
        {mainNavigationItems.map((item) => {
          const active = isRouteActive(pathname, item.activePath);
          return (
            <Pressable
              key={`${item.label}-${item.activePath}`}
              style={active ? styles.activeItem : styles.item}
              onPress={() => router.push(item.href as any)}
            >
              <Ionicons
                name={active ? getActiveIcon(item.icon) : item.icon}
                size={active ? 24 : getSidebarIconSize(item.icon)}
                color={active ? colors.white : colors.navy}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottom}>
        {sidebarBottomNavigationItems.map((item) => {
          const active = isRouteActive(pathname, item.activePath);
          return (
            <Pressable
              key={`${item.label}-${item.href}`}
              style={active ? styles.activeItem : styles.item}
              onPress={() => router.push(item.href as any)}
            >
              <Ionicons
                name={active ? getActiveIcon(item.icon) : item.icon}
                size={24}
                color={active ? colors.white : colors.navy}
              />
            </Pressable>
          );
        })}

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

function isRouteActive(pathname: string, href: string) {
  if (href === "/home") {
    return (
      pathname === "/" || pathname === "/home" || pathname.startsWith("/home/")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveIcon(
  icon: keyof typeof Ionicons.glyphMap,
): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case "home-outline":
      return "home";

    case "stats-chart-outline":
      return "stats-chart";

    case "heart-outline":
      return "heart";

    case "person-outline":
      return "person";

    case "settings-outline":
      return "settings";

    default:
      return icon;
  }
}

function getSidebarIconSize(icon: keyof typeof Ionicons.glyphMap) {
  switch (icon) {
    case "home-outline":
      return 24;

    case "stats-chart-outline":
      return 27;

    case "heart-outline":
      return 28;

    case "person-outline":
      return 28;

    default:
      return 24;
  }
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
