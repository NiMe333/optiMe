import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

import {
  mainNavigationItems,
  type NavigationItem,
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
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  function blurWebFocus() {
    if (Platform.OS !== "web") return;

    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();
  }

  function navigateTo(href: string) {
    blurWebFocus();
    router.replace(href as any);
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        {mainNavigationItems.map((item) => {
          const active = isRouteActive(pathname, item.activePath);

          return (
            <MobileNavItem
              key={`${item.label}-${item.activePath}`}
              item={item}
              active={active}
              onPress={() => navigateTo(item.href)}
            />
          );
        })}
      </View>
    </View>
  );
}

function MobileNavItem({
  item,
  active,
  onPress,
}: {
  item: NavigationItem;
  active: boolean;
  onPress: () => void;
}) {
  const activeProgress = useRef(new Animated.Value(active ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: active ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [active, activeProgress]);

  function handlePressIn() {
    Animated.spring(pressScale, {
      toValue: 0.92,
      speed: 28,
      bounciness: 6,
      useNativeDriver: false,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(pressScale, {
      toValue: 1,
      speed: 24,
      bounciness: 8,
      useNativeDriver: false,
    }).start();
  }

  const backgroundColor = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(24,63,104,0)", colors.navy],
  });

  const translateY = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const activeScale = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const iconScale = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={10}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.navItem,
          {
            backgroundColor,
            transform: [
              { translateY },
              { scale: activeScale },
              { scale: pressScale },
            ],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: iconScale }],
          }}
        >
          <Ionicons
            name={active ? getActiveIcon(item.icon) : item.icon}
            size={getMobileIconSize(item.icon)}
            color={active ? colors.white : colors.navy}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function isRouteActive(pathname: string, activePath: string) {
  if (activePath === "/home") {
    return pathname === "/" || pathname === "/home";
  }

  return pathname === activePath || pathname.startsWith(`${activePath}/`);
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

function getMobileIconSize(icon: keyof typeof Ionicons.glyphMap) {
  switch (icon) {
    case "home-outline":
      return 24;

    case "stats-chart-outline":
      return 26;

    case "heart-outline":
      return 27;

    case "person-outline":
      return 27;

    default:
      return 24;
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

    backgroundColor: "rgba(255,255,255,0.86)",

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

  pressable: {
    width: 52,
    height: 52,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  navItem: {
    width: 46,
    height: 46,
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
});
