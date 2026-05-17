import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

import { mainNavigationItems } from "@/constants/navigationItems";

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
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {mainNavigationItems.map((item) => {
          const active = isRouteActive(pathname, item.activePath);

          return (
            <Pressable
              key={`${item.label}-${item.href}`}
              style={active ? styles.activeItem : styles.item}
              onPress={() => router.push(item.href as any)}
            >
              <Ionicons
                name={active ? getActiveIcon(item.icon) : item.icon}
                size={active ? 20 : 26}
                color={active ? colors.white : colors.navy}
              />
            </Pressable>
          );
        })}
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

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 18,
  },

  container: {
    height: 76,

    backgroundColor: "rgba(255,255,255,0.82)",

    borderRadius: 30,

    borderWidth: 1,
    borderColor: colors.border,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },

    elevation: 8,
  },

  activeItem: {
    width: 46,
    height: 46,
    borderRadius: 16,

    backgroundColor: colors.navy,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },

  item: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
